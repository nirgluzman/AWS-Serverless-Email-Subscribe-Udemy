// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_dynamodb_code_examples.html
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/putitemcommand.html

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(client);

import { v4 as uuid } from 'uuid';

export const subscribeUser = async (event) => {
  console.log('event', event);

  const data = JSON.parse(event.body);
  if (!data || typeof data.email !== 'string') {
    console.error('missing body or email');
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 400,
      body: JSON.stringify({
        message: 'missing body or email',
      }),
    };
  }

  const newUser = {
    userId: uuid(),
    email: data.email,
    subscriber: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const command = new PutCommand({
    TableName: process.env.USERS_TABLE,
    Item: newUser,
  });

  try {
    await docClient.send(command);

    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.error(error);
    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 500,
      body: JSON.stringify(error.message),
    };
  }
};
