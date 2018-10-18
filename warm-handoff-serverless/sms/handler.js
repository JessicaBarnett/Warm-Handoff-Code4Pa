'use strict';
const Twilio = require('twilio');
const twilioClient = new Twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_KEY
);

module.exports.send = (event, context, callback) => {
    // const body = JSON.parse(event.body);
    // const phoneNumber = body.phone_number;

    // if ( typeof phoneNumber !== 'string' ) {
    //     console.error('no phone number passed');
    //     // callback(new Error('no Phone number passed'));
    //     return;
    // }

    // twilioClient.calls.create({
    //     url: 'https://ejawydf2wf.execute-api.us-east-1.amazonaws.com/dev/ivr/start',
    //     to: process.env.TEST_PHONE_NUMBER,
    //     from: process.env.TWILIO_PHONE_NUMBER
    // }, function(error, call) {
    //     if (error) {
    //         console.error(error);
    //         // callback(new Error('There was an error making your call.'));
    //         return;
    //     }
    //     if (callback) {
    //         callback(call);
    //     }
    // });

    // const response = {
    //     statusCode: 200,
    //     body: 'triggering call'
    // }

    // callback(null, response);

    const response = {
        statusCode: 200,
        body: 'omgeeeee'
    }

    callback(null, response);
};

