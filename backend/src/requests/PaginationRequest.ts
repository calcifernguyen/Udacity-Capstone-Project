import { Key } from "aws-sdk/clients/dynamodb";

export interface PaginationRequest {
  limit: number;
  startKey?: Key;
}