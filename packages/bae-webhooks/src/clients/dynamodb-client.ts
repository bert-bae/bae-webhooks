import { DynamoDB } from "aws-sdk";
import { BaseClient, BaseClientInput } from "./base-client";

type DynamoDBQueryInput = DynamoDB.DocumentClient.QueryInput;
type DynamoDBQueryOutput = DynamoDB.DocumentClient.QueryOutput["Items"];
type DynamoDBPutInput = DynamoDB.DocumentClient.PutItemInput;
type DynamoDBPutOutput = DynamoDB.DocumentClient.PutItemOutput;
type DynamoDBDeleteInput = DynamoDB.DocumentClient.DeleteItemInput;
type DynamoDBDeleteOutput = DynamoDB.DocumentClient.DeleteItemOutput;

export class DynamoDBClient extends BaseClient {
  protected client: DynamoDB.DocumentClient;
  private tableName: string;
  public primaryKey: string;
  public rangeKey?: string;

  constructor(tableName, primaryKey, rangeKey?) {
    super();
    this.client = new DynamoDB.DocumentClient({
      region: process.env.DYNAMODB_REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT,
    });
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.rangeKey = rangeKey || undefined;
  }

  public async create(
    input: BaseClientInput & Record<string, any>
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
    input: BaseClientInput & { rangeExpression?: string }
  ): Promise<DynamoDBQueryOutput> {
    const params: DynamoDBQueryInput = {
      TableName: this.tableName,
      KeyConditionExpression: `#${this.primaryKey} = :pkey`,
      ExpressionAttributeNames: {
        [`#${this.primaryKey}`]: this.primaryKey,
      },
      ExpressionAttributeValues: {
        ":pkey": input[this.primaryKey],
      },
    };

    if (
      this.rangeKey &&
      input.hasOwnProperty(this.rangeKey) &&
      input.rangeExpression
    ) {
      params.ExpressionAttributeNames[`#${this.rangeKey}`] = this.rangeKey;
      params.ExpressionAttributeValues[":rkey"] = input[this.rangeKey];
      params.KeyConditionExpression += ` and #${input.rangeExpression}`;
    }

    const result = await this.client.query(params).promise();
    return result.Items;
  }

  public async update(
    input: BaseClientInput & Record<string, any>
  ): Promise<DynamoDBPutOutput> {
    return this.create(input);
  }

  public async delete(input: BaseClientInput): Promise<DynamoDBDeleteOutput> {
    const params: DynamoDBDeleteInput = {
      TableName: this.tableName,
      Key: {
        [this.primaryKey]: input[this.primaryKey],
      },
    };

    if (this.rangeKey && input.hasOwnProperty(this.rangeKey)) {
      params.Key[this.rangeKey] = input[this.rangeKey];
    }

    return this.client.delete(params).promise();
  }
}
