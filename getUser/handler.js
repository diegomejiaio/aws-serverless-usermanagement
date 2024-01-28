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

const getUser = async (event, context) => {

    let userId = event.pathParameters.id;

    var params = {
        ExpressionAttributeValues: {
            ':pk': userId
        },
        KeyConditionExpression: 'pk = :pk',
        TableName: 'usersTable'
    };

    return dynamodb.query(params).promise().then((data) => {
        return {
            "statusCode": 200,
            "body": JSON.stringify(data),
        }
    }).catch((err) => {
        console.log(err);
    });

    
}
module.exports = {
    getUser
}
