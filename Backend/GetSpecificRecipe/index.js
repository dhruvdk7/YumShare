const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
//https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
//Using event in lambda handler
exports.handler = async (event) => {
  try {
    const recipeId = event.pathParameters.id;

    const getParams = {
      TableName: 'Recipe', 
      Key: { recipeId },
    };

    const recipe = await dynamodb.get(getParams).promise();

    if (!recipe.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Recipe not found.' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: recipe.Item }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to fetch the recipe details.' }),
    };
  }
};
