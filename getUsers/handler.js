const AWS = require('aws-sdk')
let dynamoDbOptions = {};

if (process.env.IS_OFFLINE) {
    dynamoDbOptions = {
        region: 'localhost',
        endpoint: 'http://0.0.0.0:8000',
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey',
    };
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoDbOptions)

const getUsers = async (event, context) => {

    var params = {
        TableName: 'usersTable'
    };

    return dynamodb.scan(params).promise().then((data) => {
        return {
            "statusCode": 200,
            "body": JSON.stringify(data),
        }
    }).catch((err) => {
        console.log(err);
    });

    
}
module.exports = {
    getUsers
}
