const _ = require('lodash');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const queryString = require('query-string');

// hard-coded for demo purposes
const demoFacility =  {
    "phone_number": "+19999999999",
    "updated_at": 1539553745249,
    "created_at": 1539553745249,
    "address": "132 S 10th St, Philadelphia, PA 19107",
    "id": "f87cc420-cffa-11e8-98bb-05afd009eca8",
    "facility_name": "Jefferson University Hospital"
};


/******************
 * Helpers
 ******************/

const getTwimlResponse = function getTwimlResponse(endpoint, text, options) {
    const voiceResponse = new VoiceResponse();
    const gatherOptions = {
      language: 'en-US',
      method: 'POST',
      action: endpoint
    };

    if (options) {
      _.assign(gatherOptions, options);
    }

    const gather = voiceResponse.gather(gatherOptions);

    gather.say(text);
    return voiceResponse.toString();
};

// TODO: have to get the facility passed in here somehow...
// const redirectToStart = function redirectToStart(crsRequest) {
//     return module.exports.start('restart');
// };


/******************
 * Lambdas
 ******************/

module.exports.test = (event, context, callback) => {
    const twiml = new VoiceResponse();
    twiml.say({ voice: 'alice' }, 'hello!');

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/xml'
        },
        body: twiml.toString()
    }

    callback(null, response);
}

// Event comes from twilio
// Seem to be getting a uri-encoded string from event.body when it's called by twilio...
// but stringified json fron anywhere else...
module.exports.start = (event, context, callback) => {
    var twiml;
    var body;
    var facility = _.clone(demoFacility);

    // to account for twilip sending us a uri-encoded query string as the body. :P
    // also technically I don't think I need anything in here...  'cept maybe the 'called' numbers
    if (event.headers && event.headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
        body = queryString.parse(decodeURIComponent(event.body));
    } else {
        body = JSON.parse(event.body);
    }

    twiml = getTwimlResponse(
        `${process.env.TWILIO_HOST}/ivr/availability`,
        `Hello.  This is the CRS dispatch system.
         A CRS is needed at ${facility.facility_name}.
         Are you available to respond to this request?
         Please press (1) for yes or (2) for no.`,
         {numDigits: '1'}
      );

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/xml'
        },
        body: twiml.toString()
    }

    callback(null, response);
}

// TODO: figure out how to redirectToStart lambda if any other
// number is entered.  probably lambda.invoke
module.exports.availability = (event, context, callback) => {
    const body = JSON.parse(event.body);
    const digit = event.digit;
    var twiml;

    if (digit === '1') {
        twiml = accept();
    } else if (digit === '2') {
        twiml = decline();
    }a

    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/xml'
        },
        body: twiml.toString()
    }

    callback(null, response)
}

// - Send Text to CRS
// - Send Text to Caller/EMS
// - start timer for CRS so the same person doesn't get called again
//   until a certain period of time passes
// add request to CRS request history
const accept = function accept() {
    return getTwimlResponse(
      `${process.env.TWILIO_HOST}/crs/accept`,
      `You have accepted this request.  We will send a text shortly
       with more information.  Thank you.  Goodbye.`
    );
};

// add request to CRS request history as declined
// trigger system to call the next CRS
const decline = function decline() {
    return getTwimlResponse(
      `${process.env.TWILIO_HOST}/crs/decline`,
      `You have declined this request.  You may receive additional
      calls from this system until your on-call hours end.
      Thank you. Goodbye.`
    );
};


