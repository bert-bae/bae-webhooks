const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB({
  region: "localhost",
  endpoint: "http://localhost:8000",
});

console.log(`Initializing Dynamodb tables...`);

const tables = [
  {
    TableName: "Owners",
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
    ],
  },
  {
    TableName: "Webhooks",
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S",
      },
      {
        AttributeName: "ownerId",
        AttributeType: "S",
      },
    ],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH",
      },
      {
        AttributeName: "ownerId",
        KeyType: "RANGE",
      },
    ],
  },
];

tables.forEach((table, i) => {
  docClient.createTable(table, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`=====Created "${table.TableName}" table======`);
      console.log(data);
    }
  });
});
