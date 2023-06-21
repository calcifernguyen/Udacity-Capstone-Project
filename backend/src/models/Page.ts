import { Key } from "aws-sdk/clients/dynamodb";

export interface Page {
  items: any[];
  nextKey?: Key;
}
