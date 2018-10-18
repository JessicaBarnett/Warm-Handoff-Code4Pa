var aws = require('aws-sdk');
var lambda = new aws.Lambda({
  region: 'us-east-1'
});

// needs to pass a facility id , or maybe thewhole facility object... don't know
module.exports.start = (event, context, callback) => {
    const body = JSON.parse(event.body);

    if (typeof body.facility!== 'object' || typeof body.requested_by_number) {
        console.error('invalid facility object');
        callback(new Error('invalid facility information'));
        return;
    }

    // create job object for other parts of app to reference
    // TODO - use bluebird or something to make this less awful...
    lambda.invoke({
        FunctionName: 'create_job',
        Payload: JSON.stringify(event, null, 2)
      }, function(error, data) {
        if (error) {
          context.done('error', error);
        }
        if(data.Payload){
         context.succeed(data.Payload);
        }
    }).then(

    );

    // get next CRS

    // trigger first phone call
}

module.exports.find_next_recovery_specialist = (event, context, callback) => {
    lambda.invoke({
        FunctionName: 'list_recovery_specialists'
    }, function(error, data) {
        if (error) {
          context.done('error', error);
        }
        if(data.Payload){
            context.succeed(data.Payload);
        }
    });
}



/* super extra minimal product:
    - endpoint
    - triggers phone call - "CRS" phone number and address is hard-coded for dem purposes
    - on accept, an sms is sent (also hard-coded)


*/