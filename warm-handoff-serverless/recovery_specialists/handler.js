'use strict';
const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
            job_history: [],
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
            console.error(error);
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

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: 'recovery_specialists_table_2',
        Key: {
            id: event.pathParameters.id
        }
    }

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('couldn\'t get CRS'));
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
        TableName: 'recovery_specialists_table_2'
      };

      dynamoDb.delete(params, function(error, result) {
        if (error) {
            console.error(error);
            callback(new Error('failed to delete CRS'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully deleted CRS.')
        }

        callback(null, response);
      });
}

// Requires ALL fields to be passed in via body.
// Not ideal, but patch updates were a pain...  Need to sort that out later.
module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const body = JSON.parse(event.body);

    if ( typeof body.first_name !==  'string' ||
         typeof body.last_name !==  'string' ||
         typeof body.phone_number !==  'string' ||
         typeof body.address !==  'string' ||
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
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number,
            address: body.address,
            status: body.status,
            created_at: body.created_at,
            updated_at: timestamp,
            job_history: body.job_history
        }
    }

    dynamoDb.put(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('failed to update CRS'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully updated CRS')
        }

        callback(null, response);
    });
}