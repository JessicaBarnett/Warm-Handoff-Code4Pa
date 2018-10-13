const twilio = require('twilio');
const Router = require('express').Router;

const router = new Router();


/****************************
     Client App (eventually...)
*****************************/

router.get('/', (req, res) => {
    res.render('home page');
});


/****************************
     Job Manager
*****************************/

    /*
        POST start-request
        params: facility
        action: starts the request process:
            * creates a 'job' object in redis
            * requests the next available CRS from the Data Manager (crs/next)
            * request facility information from the Data Manager (facility/:facility_id)
            * start a new call with the facility phone number (communication/outbound_call)
            * If Declined, restarts process
            * If Accepted
                * sends 2 sms messages (communication/sms)
                    * 1 to CRS w/ facility info
                    * 1 to EMS to indicate a dispatch has happened
                * Copies Job Object from Redis into DynamoDb
                * Triggers Updates on...
                    * the CRS object (with the most recent call)
                    *
         {
             from_phone_number: "phone number to send sms dispatch updates to",
             facility_id: "id of the facility the CRS should be sent to"
         }
    */



/****************************
    Data Manager
*****************************/

    /*
        POST crs/new
        params: "CRS" object - see data schemas
        action: Creates a new CRS object in DynamoDB
    */

    /*
        POST crs/next
        params: facility, array of CRS Ids that have previously declined the job
        action: Searches in DynamoDB for the closest available CRS who has not already declined the request
    */

    /*
        POST facility/new
        params: "facility" object - see data schemas
        action: Creates a new facility object in DynamoDB
    */

    /*
        GET facility/:facility_id
        params:
        action: Searches in DynamoDB for the closest available CRS who has not already declined the request
    */

    /*
        Will need Updates as well, when the call is dispatched.  Will add when I get to that point.
    */


/****************************
     Communication API
*****************************/

    /*
        POST communication/outbound_call
        params: phone_number
        action: Makes an outbound call to the indicated number with the CRS IVR
    */

    /*
        POST communication/sms
        params: phone_number, message_text
        action: Sends an SMS to the indicated number
    */

    /*
        POST communication/inbound
        action: routes inbound calls to the CRS IVR entry point (ivr/main)
    */


/****************************
     CRS IVR
*****************************/

    /*
        POST ivr/main
        params: facility information
        action: asks "are you available?".  Collects yes/no answer.
    */

    /*
        POST ivr/process-availability
        params: req.body.Digits (from twilio, contains user response)
        action: routes to either "accept" or "decline" handlers
    */

    /*
        POST ivr/accept
        action: CRS accepts request.
    */


    /*
        POST ivr/decline
        action: CRS declines request.
    */