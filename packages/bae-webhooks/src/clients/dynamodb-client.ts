import { DynamoDB } from "aws-sdk";
import { BaseClient, BaseClientInput } from "./base-client";

type DynamoDBQueryInput = DynamoDB.DocumentClient.QueryInput;
type DynamoDBQueryOutput = DynamoDB.DocumentClient.QueryOutput;
type DynamoDBPutInput = DynamoDB.DocumentClient.PutItemInput;
type DynamoDBPutOutput = DynamoDB.DocumentClient.PutItemOutput;
type DynamoDBDeleteInput = DynamoDB.DocumentClient.DeleteItemInput;
type DynamoDBDeleteOutput = DynamoDB.DocumentClient.DeleteItemOutput;

type DynamoDBKeys = BaseClientInput & { rangeKey?: string | number };

export class DynamoDBClient extends BaseClient {
  protected client: DynamoDB.DocumentClient;
  private tableName: string;
  public primaryKey: string;
  public rangeKey?: string;

  constructor(tableName, primaryKey, rangeKey?) {
    super();
    this.client = new DynamoDB.DocumentClient();
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.rangeKey = rangeKey || undefined;
  }

  public async create(
    input: DynamoDBKeys & Record<string, any>
  ): Promise<DynamoDBPutOutput> {
    const { id, rangeKey, ...data } = input;
    const params: DynamoDBPutInput = {
      TableName: this.tableName,
      Item: {
        [this.primaryKey]: id,
        ...data,
      },
    };

    if (this.rangeKey && rangeKey) {
      params.Item[this.rangeKey] = rangeKey;
    }

    return this.client.put(params).promise();
  }

  public async read(
    input: DynamoDBKeys & { rangeExpression?: string }
  ): Promise<DynamoDBQueryOutput> {
    const params: DynamoDBQueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: `${this.primaryKey} = :pkey`,
      ExpressionAttributeValues: {
        ":pkey": input.id,
      },
    };

    if (this.rangeKey && input.rangeKey && input.rangeExpression) {
      params.ExpressionAttributeValues[":rkey"] = input.rangeKey;
      params.KeyConditionExpression += ` ${input.rangeExpression}`;
    }

    return this.client.query(params).promise();
  }

  public async update(
    input: DynamoDBKeys & Record<string, any>
  ): Promise<DynamoDBPutOutput> {
    return this.create(input);
  }

  public async delete(input: DynamoDBKeys): Promise<DynamoDBDeleteOutput> {
    const params: DynamoDBDeleteInput = {
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: input.id,
      },
    };

    if (this.rangeKey && input.rangeKey) {
      params.Key[this.rangeKey] = input.rangeKey;
    }

    return this.client.delete(params).promise();
  }
}
