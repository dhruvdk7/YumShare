const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
//https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
//Using event in lambda handler
exports.handler = async (event) => {
  try {
    const scanParams = {
      TableName: 'Recipe', 
    };

    const scanResult = await dynamodb.scan(scanParams).promise();

    if (scanResult.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No recipes found.' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ recipes: scanResult.Items }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch recipes.' }),
    };
  }
};
