import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { Key } from "aws-sdk/clients/dynamodb";

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export function encodeNextKey(nextKey: Key): string {
  if (!nextKey) return null;
  else {
    const nextKeyJson: string = JSON.stringify(nextKey);
    const nextKeyBase64 = Buffer.from(nextKeyJson).toString("base64");
    return nextKeyBase64;
  }
}

export function decodeNextKey(nextKeyBase64: string): Key {
  if (!nextKeyBase64) return undefined;
  else {
    const nextKeyJson = Buffer.from(nextKeyBase64, "base64").toString("ascii");
    const nextKey: Key = JSON.parse(nextKeyJson);
    return nextKey;
  }
}

export function getQueryParameter(event: APIGatewayProxyEvent, name: string) {
  const queryParams = event.queryStringParameters
  return queryParams ? queryParams[name] : undefined;
}