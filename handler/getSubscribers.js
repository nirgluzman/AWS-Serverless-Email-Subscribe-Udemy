// https://docs.aws.amazon.com/sdk-for-javascript/v3    /developer-guide/javascript_dynamodb_code_examples.html
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const USERS_TABLE = process.env.USERS_TABLE;
const client = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(client);

export const getSubscribers = async (event, context) => {
  console.log('event', event);
  console.log('context', context);

  try {
    const data = await docClient.send(
      new ScanCommand({
        TableName: USERS_TABLE,
        ProjectionExpression: 'email',
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};
