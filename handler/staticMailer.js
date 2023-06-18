// https://docs.aws.amazon.com/sns/latest/dg/sns-publishing.html

import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
const snsClient = new SNSClient({ region: process.env.REGION });

import axios from 'axios';

export const staticMailer = async (event) => {
  console.log('event', event);

  const data = JSON.parse(event.body);
  const emailBody = buildEmailBody(event.requestContext.identity, data);

  try {
    await axios.post(
      'https://x5krb1cbe6.execute-api.us-east-1.amazonaws.com/dev/subscribe',
      {
        email: data.email,
      }
    );

    await snsClient.send(
      new PublishCommand({
        Message: emailBody,
        Subject: 'New subscription',
        TopicArn: process.env.SNS_TOPIC_ARN,
      })
    );

    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify({ message: 'Ok' }),
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

const buildEmailBody = (id, form) => {
  return `
        Message: ${form.message}
        Name: ${form.name}
        Email: ${form.email}
        Service information: ${id.sourceIp} - ${id.userAgent}`;
};
