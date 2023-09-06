const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();
//https://docs.aws.amazon.com/lambda/latest/dg/with-s3-example.html
//Reference : Adding data to the S3

//Adding image to the S3
//https://stackoverflow.com/questions/7511321/uploading-base64-encoded-image-to-amazon-s3-via-node-js
exports.handler = async (event) => {
  const {
    recipeName,
    ingredients,
    preparationSteps,
    cookingTime,
    cuisine,
    difficulty,
    servingSize,
    imageBase64,
    userId,
  } = JSON.parse(event.body);

  if (
    !recipeName ||
    !ingredients ||
    !preparationSteps ||
    !cookingTime ||
    !cuisine ||
    !difficulty ||
    !servingSize ||
    !imageBase64
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Please fill all the required fields and provide the image in Base64 format.' }),
    };
  }

  const binaryImage = Buffer.from(imageBase64, 'base64');

  const filename = `${uuidv4()}.jpg`;

  const s3Params = {
    Bucket: 'recipesharingphotos',
    Key: filename,
    Body: binaryImage,
    ContentType: 'image/jpeg',
  };
//putting images in the bucket
  try {
    await s3.putObject(s3Params).promise();
    const recipeData = {
      recipeId: uuidv4(),
      recipeName,
      ingredients,
      preparationSteps,
      cookingTime,
      cuisine,
      difficulty,
      servingSize,
      imageUrl: `https://${s3Params.Bucket}.s3.${AWS.config.region}.amazonaws.com/${filename}`,
      userId, 
    };

    const dynamoParams = {
      TableName: 'Recipe',
      Item: recipeData,
    };
    await dynamodb.put(dynamoParams).promise();
    const sqsParams = {
      MessageBody: JSON.stringify(recipeData),
      QueueUrl: process.env.SQS_URL, 
    };
    const result = await sqs.sendMessage(sqsParams).promise();
    console.log('Message sent successfully:', result.MessageId);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Recipe Added Successfully', recipe: sqsParams}),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to add the recipe.' }),
    };
  }
};
