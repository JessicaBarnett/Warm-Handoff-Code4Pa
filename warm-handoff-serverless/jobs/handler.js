'use strict';
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const body = JSON.parse(event.body);

    if ( typeof body.facility !== 'object' || typeof body.requested_by_number !==  'string') {
        console.error(error);
        callback(new Error('failed to create Job'));
        return;
    }

    const params = {
        TableName: 'jobs_table_2',
        Item: {
            id: uuid(),
            requested_by_number: body.requested_by_number,
            facility: body.facility,
            status: 'pending',
            created_at: timestamp,
            updated_at: timestamp
        }
    }

    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('failed to create Job'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully created Job')
        }

        callback(null, response);
    });
}

module.exports.list = (event, context, callback) => {
    const params = {
        TableName: 'jobs_table_2'
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('couldn\'t fetch job list.'));
            return;
        }
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items)
        };

        callback(null, response)
    });
};


module.exports.get = (event, context, callback) => {
    const params = {
        TableName: 'jobs_table_2',
        Key: {
            id: event.pathParameters.id
        }
    }

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('couldn\'t get Job'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item)
        }

        callback(null, response);
    });
}

module.exports.delete = (event, context, callback) => {
    var params = {
        Key: {
          id: event.pathParameters.id
        },
        TableName: 'jobs_table_2'
      };

      dynamoDb.delete(params, function(error, result) {
        if (error) {
            console.error(error);
            callback(new Error('failed to delete job'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully deleted job.')
        }

        callback(null, response);
      });
}