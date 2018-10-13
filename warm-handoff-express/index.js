const dotenv = require('dotenv').config();
const app = require('./app');

const server = app.listen(process.env.PORT, function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = server;
