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
    const params = {
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

// Requires ALL fields to be passed in via body.
// Not ideal, but patch updates were a pain...  Need to sort that out later.
// All that should ever change for this one is status, updated_at, and job history
module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const body = JSON.parse(event.body);

    if (typeof body.requested_by_number !== 'string' ||
        typeof body.facility !== 'object' ||
        typeof body.status !== 'string' ||
        typeof body.created_at !== 'number' ||
        Array.isArray(body.job_history)) {
        console.error(error);
        callback(new Error('failed validation'));
        return;
    }

    const params = {
        TableName: 'recovery_specialists_table_2',
        Item: {
            id: event.pathParameters.id,
            requested_by_number: body.requested_by_number,
            facility: body.facility,
            status: body.status,
            created_at: body.created_at,
            updated_at: timestamp,
            job_history: body.job_history
        }
    }

    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('failed to update Job'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully updated Job')
        }

        callback(null, response);
    });
}