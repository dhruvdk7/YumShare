const AWS = require('aws-sdk');
//https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
//Using event in lambda handler
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
exports.handler = async (event) => {
  const queueUrl = process.env.SQS_URL; 
  const topicArn = process.env.SNS_ARN; 
//https://stackoverflow.com/questions/75745436/create-manage-aws-sqs-producer-and-consumer-for-dynamic-queues-in-nodejs-app
//Reference Giving mesaage in SQS Queue
  try {
    const receiveParams = {
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 20,
    };
    const messages = await sqs.receiveMessage(receiveParams).promise();

    if (messages.Messages) {
      for (const message of messages.Messages) {
        const recipeData = JSON.parse(message.Body);
        const dynamicMessage = `The recipe for ${recipeData.recipeName} which is ${recipeData.difficulty} has been created for you.`;
        console.log(dynamicMessage)
        const snsParams = {
          Message: dynamicMessage,
          TopicArn: topicArn,
        };
        const snsResponse = await sns.publish(snsParams).promise();
        console.log(snsResponse)
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle,
        };
        await sqs.deleteMessage(deleteParams).promise();

        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Messages processed successfully.', snsMessageId: snsResponse.MessageId }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'No messages to process.' }),
    };
  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to process messages from the queue.' }),
    };
  }
};
