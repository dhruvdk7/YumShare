const AWS = require('aws-sdk');
//https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
//Using event in lambda handler
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = 'Recipe'; 
exports.handler = async (event) => {
  try {
    const  recipeId = event.pathParameters.id;
    const getParams = {
      TableName: tableName,
      Key: { recipeId },
    };
    const existingRecipe = await dynamodb.get(getParams).promise();
    if (!existingRecipe.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Recipe not found.' }),
      };
    }
    const deleteParams = {
      TableName: tableName,
      Key: { recipeId },
    };

    await dynamodb.delete(deleteParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Recipe deleted successfully.' }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to delete the recipe.' }),
    };
  }
};
