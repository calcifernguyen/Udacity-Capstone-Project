import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser, getTodosForUsersWithPagination } from '../../helpers/todos'
import { getUserId, encodeNextKey, decodeNextKey, getQueryParameter } from '../utils';
import { TodoItem } from '../../models/TodoItem'
import { createLogger } from '../../utils/logger'
import { Page } from '../../models/Page'
import { PaginationRequest } from '../../requests/PaginationRequest'

const logger = createLogger('getTodos');

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here    
    const userId: string = getUserId(event);
    const limit: string = getQueryParameter(event, 'limit');
    const nextKey: string = getQueryParameter(event, 'nextKey');
    let response: APIGatewayProxyResult | PromiseLike<APIGatewayProxyResult>;

    try {

      if (limit) {
        const paginationRequest: PaginationRequest = {
          limit: parseInt(limit),
          startKey: decodeNextKey(nextKey)
        }
        const page: Page = await getTodosForUsersWithPagination(userId, paginationRequest);

        response = {
          statusCode: 200,
          body: JSON.stringify({
            items: page.items,
            nextKey: encodeNextKey(page.nextKey)
          })
        }

      } else {
        const todos: TodoItem[] = await getTodosForUser(userId);

        response = {
          statusCode: 200,
          body: JSON.stringify({
            items: todos
          })
        };
      }
    } catch (e) {
      logger.error(`Error creating Todo item: ${e.message}`)

      response = {
        statusCode: 500,
        body: JSON.stringify({
          error: e.message
        })
      }
    }

    return response;
  }
);

handler.use(
  cors({
    origin: "*",
    credentials: true
  })
);



