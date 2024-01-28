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

const updateUsers = async (event, context) => {

    let userId = event.pathParameters.id

    const body = JSON.parse(event.body)

    var params = {
        TableName: usersTable,
        Key: {
            id: userId
        },
        UpdateExpression: "set #name = :name",
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':name': body.name
        },
        KeyConditionExpression: 'id = :id',
        ReturnValues: 'ALL_NEW'
    }
    
    return dynamodb.update(params).promise()
        .then(response => {
            return {
                statusCode: 200,
                body: JSON.stringify(response.Item)
            }
        })
        .catch(error => {
            console.log(error)
            return {
                statusCode: 400,
                error: `Could not update user: ${error.stack}`
            }
        })
}
module.exports = {
    updateUsers
}
