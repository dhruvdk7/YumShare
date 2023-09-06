const AWS = require('aws-sdk');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
//https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
//Using event in lambda handler
exports.handler = async (event) => {
  try {
    const  userId  = event.pathParameters.id;

    const scanParams = {
      TableName: 'Recipe', 
      FilterExpression: 'userId = :id',
      ExpressionAttributeValues: {
        ':id': userId,
      },
    };

    const scanResult = await dynamoDB.scan(scanParams).promise();

    if (scanResult.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No recipes found for the specified user.' }),
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
