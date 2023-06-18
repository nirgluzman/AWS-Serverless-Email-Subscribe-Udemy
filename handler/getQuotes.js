// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/
// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/getobjectcommand.html
// https://docs.aws.amazon.com/AmazonS3/latest/userguide/example_s3_GetObject_section.html

import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'; // ES Modules import
const s3Client = new S3Client({ region: process.env.REGION }); // Create S3 service object

export const getQuotes = async (event) => {
  console.log('event', event);

  const input = {
    Bucket: process.env.QUOTES_BUCKET,
    Key: 'quotes.json',
  };
  const command = new GetObjectCommand(input);

  try {
    const data = await s3Client.send(command);
    const bodyString = await data.Body.transformToString(); // Convert the body from Buffer to string
    const jsonObject = JSON.parse(bodyString); // Convert the string to a JSON object

    return {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: JSON.stringify(jsonObject),
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
