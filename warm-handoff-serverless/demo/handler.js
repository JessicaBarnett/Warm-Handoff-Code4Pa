const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const lambda = new AWS.Lambda();
const _ = require('lodash');

// hard-coded for demo purposes.
const dummyRecoverySpecialists = [{
        "updated_at": 1539550368172,
        "created_at": 1539550368172,
        "last_name": "Mayer",
        "first_name": "Vaughan",
        "status": "unavailable",
        "phone_number": "+18565345724",
        "address": "338 Tipple Road, Philadelphia PA, 19143",
        "id": "1b97b5d0-cff3-11e8-a01f-6b6105fa7589",
        "job_history": []
    },{
        "updated_at": 1539546506752,
        "created_at": 1539546506752,
        "last_name": "Parrish",
        "first_name": "Guinevere",
        "status": "unavailable",
        "phone_number": "+18565345724",
        "address": "64 Jewel St. Goodville, PA 17528",
        "id": "1e01a000-cfea-11e8-b415-f3a2959b26c1",
        "job_history": []
    },{
        "updated_at": 1539546498689,
        "created_at": 1539546498689,
        "last_name": "Walter",
        "first_name": "Adrienne",
        "status": "unavailable",
        "phone_number": "+18565345724",
        "address": "157 Justice Ave. Fayette City, PA 15438",
        "id": "19334f10-cfea-11e8-b415-f3a2959b26c1",
        "job_history": []
    },{
        "updated_at": 1539547841349,
        "created_at": 1539547841349,
        "last_name": "Gonzalez",
        "first_name": "Aimee",
        "status": "unavailable",
        "phone_number": "+18565345724",
        "address": "118 N 9th St, Philadelphia, PA 19107",
        "id": "397cf750-cfed-11e8-b415-f3a2959b26c1",
        "job_history": []
    }];

const getNextCrs = (alreadyCalledIds) => {
    const filteredCrsList = _.filter(dummyRecoverySpecialists, (crs) => {
        return !alreadyCalledIds.includes(crs.id);
    });
    const index = _.random(0, dummyRecoverySpecialists.length - 1);

    return filteredCrsList[index];
}


// I don't understand, but this function works, but then passes an internal server error in the response?  huh?
// Am I returning the wrong thing from the call function?  that has to be it...
module.exports.start = (event, context, callback) => {
    const body = JSON.parse(event.body);
    const requestedByNumber = body.requested_by_number; // how to pass this along to the post-ivr sms dispatch?  redis probs...
    const facility = body.facility;

    const jobRecord = {}; // look up in redis, create if it doesn't exist
    const alreadyCalledIds = ['1e01a000-cfea-11e8-b415-f3a2959b26c1']; // get this from redis

    const nextCrs = getNextCrs([]);
    console.log(`calling crs ${nextCrs.first_name} ${nextCrs.last_name} ${nextCrs.address} ${nextCrs.id}`)

    const callParams = {
        FunctionName: 'warm-handoff-serverless-dev-call', // the lambda function we are going to invoke
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
            body: {
                phone_number: nextCrs.phone_number,
                address: facility.address
            }
        })
    };

    lambda.invoke(callParams, function(error, data) {
        if (error) {
            console.error(error);
            callback(error);
            return;
        }
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: event
        }

        callback(null, response);
    });
}