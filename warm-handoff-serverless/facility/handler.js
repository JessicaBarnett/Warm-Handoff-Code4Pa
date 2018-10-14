'use strict';
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const body = JSON.parse(event.body);

    if ( typeof body.name !==  'string' || typeof body.phone_number !==  'string' ||
         typeof body.address !==  'string' ) {
        console.error(error);
        callback(new Error('failed to create Facility'));
        return;
    }

    const params = {
        TableName: 'facility_table',
        Item: {
            id: uuid(),
            name: body.name,
            phone_number: body.phone_number,
            address: body.address,
            created_at: timestamp,
            updated_at: timestamp
        }
    }

    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('failed to create Facility'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully created facility')
        }

        callback(null, response);
    });
}