const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
//https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
//Using event in lambda handler
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const tableName = 'User';
const snsTopicArn = process.env.SNS_ARN;

exports.handler = async (event, context) => {
  try {
    const requestBody = JSON.parse(event.body);
    const { firstName, lastName, email, password } = requestBody;
    const queryParams = {
      TableName: tableName,
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    };
    const existingUser = await dynamoDB.query(queryParams).promise();
    if (existingUser.Count > 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User already exists' }),
      };
    }
    const subscriptionParams = {
      Protocol: 'email',
      TopicArn: snsTopicArn,
      Endpoint: email,
    };

    await sns.subscribe(subscriptionParams).promise();
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const params = {
      TableName: tableName,
      Item: {
        userId,
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User registered successfully', userId }),
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to register user' }),
    };
  }
};
