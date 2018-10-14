'use strict';
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const validator = require('./utils/validator');

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const body = JSON.parse(event.body);

    if ( typeof body.first_name !==  'string' || typeof body.last_name !==  'string' ||
         typeof body.phone_number !==  'string' || typeof body.address !==  'string' ) {
        console.error(error);
        callback(new Error('failed to create CRS'));
        return;
    }

    const params = {
        TableName: 'recovery_specialists_table_2',
        Item: {
            id: uuid(),
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number,
            address: body.address,
            created_at: timestamp,
            updated_at: timestamp,
            status: 'unavailable'
        }
    }

    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('failed to create CRS'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully added CRS')
        }

        callback(null, response);
    });
}

module.exports.list = (event, context, callback) => {
    const params = {
        TableName: 'recovery_specialists_table_2'
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.log(error);
            callback(new Error('couldn\'t fetch CRS list.'));
            return;
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        };

        callback(null, response)
    });
};