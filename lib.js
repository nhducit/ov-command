var Promise = require('bluebird');
var winston = require('winston');
var logger = {};
//
logger.ant = new (winston.Logger)({
  exitOnError: false, //don't crash on exception
  transports: [
    new (winston.transports.Console)(), //always use the console
    new (winston.transports.File)({filename: 'logs/ant.log'}), //log everything to the server.log
  ]
});
logger.ov2500 = new (winston.Logger)({
  exitOnError: false, //don't crash on exception
  transports: [
    new (winston.transports.Console)(), //always use the console
    new (winston.transports.File)({filename: 'logs/ov2500.log'}), //log everything to the server.log
  ]
});
logger.stage = new (winston.Logger)({
  exitOnError: false, //don't crash on exception
  transports: [
    new (winston.transports.Console)(), //always use the console
    new (winston.transports.File)({filename: 'logs/stage.log'}), //log everything to the server.log
  ]
});
//
var spawn = require('child-process-promise').spawn;
//
var antFolder = '/home/nhduc/omnivista/omnivista/release/ovnms-e-421';
var ov2500Folder = '/home/nhduc/omnivista/omnivista/ngnms/ovnms-e-421/src';
var stageFolder = '/home/nhduc/omnivista/omnivista/ngnms/ovnms-e-421/src/build/stage';
var scriptFolder = '/home/nhduc/omnivista/omnivista/ngnms/ovnms-e-421/src/build/tools/scripts';

module.exports = {
  buildAnt: buildAnt,
  buildOvCode: buildOvCode,
  buildStage: buildStage,
  build: build,
  startDefaultService: startDefaultService,
  startService: startService,
  startCustomService: startCustomService
};


function buildAnt() {
  var ant = 'ant -f release.xml buildinstallers:';
  return spawn('ant', ['-f', 'release.xml', 'buildinstallers'], {cwd: antFolder})
    .progress(function (childProcess) {
      logger.ant.info('[spawn] childProcess.pid: ', childProcess.pid);
      childProcess.stdout.on('data', function (data) {
        logger.ant.info(ant, data.toString());
      });
      childProcess.stderr.on('data', function (data) {
        logger.ant.info(ant, data.toString());
      });
    })
    .then(function () {
      logger.ant.info(ant, ' done!');
    })
    .fail(function (err) {
      logger.ant.error('[spawn] ERROR: ', err);
    });
}


function buildOvCode() {
  var build2500 = 'Build code of OV2500 & NGNMS:';
  return spawn('mvn', ['clean', 'install', '-Dtest'], {cwd: ov2500Folder})
    .progress(function (childProcess) {
      logger.ov2500.info('[spawn] childProcess.pid: ', childProcess.pid);
      childProcess.stdout.on('data', function (data) {
        logger.ov2500.info(build2500, data.toString());
      });
      childProcess.stderr.on('data', function (data) {
        logger.ov2500.info(build2500, data.toString());
      });
    })
    .then(function () {
      logger.ov2500.info(build2500, ' done!');
    })
    .fail(function (err) {
      logger.ov2500.error(build2500, ' ERROR: ', err);
    });
}

function buildStage() {
  var buildStageName = 'Build Stage';
  return spawn('mvn', ['clean', 'install'], {cwd: stageFolder})
    .progress(function (childProcess) {
      logger.stage.info('[spawn] childProcess.pid: ', childProcess.pid);
      childProcess.stdout.on('data', function (data) {
        logger.stage.info(buildStageName, data.toString());
      });
      childProcess.stderr.on('data', function (data) {
        logger.stage.info(buildStageName, data.toString());
      });
    })
    .then(function () {
      logger.stage.info(buildStageName, ' done!');
    })
    .fail(function (err) {
      logger.stage.error(buildStage, ' ERROR: ', err);
    });
}


function build() {
  var promises = [buildAnt(), buildOvCode()];
  Promise.all(promises).then(function (/*successData*/) {
    return buildStage().then(function () {
      startDefaultService();
    });
  });
}

function startDefaultService() {
  var services = ['mongodb', 'activemq', 'ovserver', 'ovclient', 'tomcat'];
  var promises = [];
  services.forEach(function (serviceName) {
    promises.push(startService(serviceName));
  });
}

function startService(serviceName) {
  var taskName = 'start service' + serviceName;
  return spawn('./runservice.sh', [serviceName], {cwd: scriptFolder})
    .progress(function (childProcess) {
      console.log('[spawn] childProcess.pid: ', childProcess.pid);
      childProcess.stdout.on('data', function (data) {
        console.log(taskName, data.toString());
      });
      childProcess.stderr.on('data', function (data) {
        console.log(taskName, data.toString());
      });
    })
    .then(function () {
      console.log(taskName, ' done!');
    })
    .fail(function (err) {
      console.error(taskName, ' ERROR: ', err);
    });
}

function startCustomService() {
  var services = ['hsqldb', 'dal', 'masterpoller', 'workerpoller', 'scheduler', 'vlan'];
  var promises = [];
  services.forEach(function (serviceName) {
    promises.push(startService(serviceName));
  });
}

