var winston = require('winston');

var logger = {};
logger.ant = new (winston.Logger)({
  exitOnError: false, //don't crash on exception
  transports: [
    // new (winston.transports.Console)(), //always use the console
    new (winston.transports.File)({filename: 'logs/ant.log'}), //log everything to the server.log
  ]
});
logger.ov2500 = new (winston.Logger)({
  exitOnError: false, //don't crash on exception
  transports: [
    // new (winston.transports.Console)(), //always use the console
    new (winston.transports.File)({filename: 'logs/ov2500.log'}), //log everything to the server.log
  ]
});
logger.stage = new (winston.Logger)({
  exitOnError: false, //don't crash on exception
  transports: [
    // new (winston.transports.Console)(), //always use the console
    new (winston.transports.File)({filename: 'logs/stage.log'}), //log everything to the server.log
  ]
});

module.exports = logger;