'use strict';
const Twilio = require('twilio');
const twilioClient = new Twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_KEY
);

module.exports.call = (event, context, callback) => {
    if (typeof event.body === 'string' && event.body.includes('phone_number')) {
        console.log(`json - ${event}`);
        var body = JSON.parse(event.body);
    } else if (typeof event.body === 'object' && event.body.phone_number) {
        console.log(`object - ${event}`);
        var body = event.body;
    } else {
        console.error('no phone number passed');
        callback(new Error('no Phone number passed'));
        return;
    }

    const phoneNumber = body.phone_number;
    console.log(`calling - ${phoneNumber}`);

    twilioClient.calls.create({
        url: `${process.env.TWILIO_HOST}/ivr/start`,
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER
    }, function(error, call) {
        if (error) {
            console.error(error);
            callback(new Error('There was an error making your call.'));
            return;
        }

        callback(call);
    });

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/plain'
        },
        body: JSON.stringify('triggering call')
    }

    callback(null, response);
};

