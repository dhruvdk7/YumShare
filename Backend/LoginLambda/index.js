const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'User';
//https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
//Using event in lambda handler
exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);
    const queryParams = {
      TableName: tableName,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };

    const data = await dynamoDB.query(queryParams).promise();

    if (data.Count === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const user = data.Items[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User authenticated successfully', userId: user.userId }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to check user existence' }),
    };
  }
};
