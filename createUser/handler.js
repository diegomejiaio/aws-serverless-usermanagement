const { randomUUID } = require("crypto")

const AWS = require('aws-sdk')
let dynamoDbOptions = {}

if (process.env.IS_OFFLINE) {
    dynamoDbOptions = {
        region: 'localhost',
        endpoint: 'http://0.0.0.0:8000',
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey',
    }
} 

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoDbOptions)

// POST method to create a user
const createUser = async (event, context) => {

    // Create a unique id for the user
    let userId = randomUUID();
    
    // Get the request body
    let userBody = JSON.parse(event.body);

    // Create the user object
    let user = {
        pk: userId,
        name: userBody.name,
    }

    // Create the params object for the DynamoDB call
    var params = {
        Item: user,
        TableName: 'usersTable'
    };

    // Call DynamoDB to add the item to the table
    return dynamodb.put(params).promise().then((data) => {
        return {
            "statusCode": 200,
            "body": JSON.stringify(user),
        }
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = { createUser };
