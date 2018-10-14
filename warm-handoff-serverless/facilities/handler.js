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
        TableName: 'facilities_table_2',
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

module.exports.list = (event, context, callback) => {
    const params = {
        TableName: 'facilities_table_2'
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('couldn\'t fetch facility list.'));
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
        TableName: 'facilities_table_2',
        Key: {
            id: event.pathParameters.id
        }
    }

    dynamoDb.get(params, (error, result) => {
        if (error) {
            console.error(error);
            callback(new Error('couldn\'t get Facility'));
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
        TableName: 'facilities_table_2'
      };

      dynamoDb.delete(params, function(error, result) {
        if (error) {
            console.error(error);
            callback(new Error('failed to delete Facility'));
            return;
        }

        const response = {
            statusCode: 200,
            body: JSON.stringify('successfully deleted Facility.')
        }

        callback(null, response);
      });
}