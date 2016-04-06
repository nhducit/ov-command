var Promise = require('bluebird');
var fs = require('fs');
var spawn = require('child-process-promise').spawn;
var exec = require('child-process-promise').exec;
//
var config = require('./config');
var logger = require('./logger');
//

//

module.exports = {
  startDefaultService: startDefaultService,
  startService: startService,
  startCustomService: startCustomService
};
/**
 *
 */
function startDefaultService() {
  var services = ['mongodb', 'activemq', 'ovserver', 'ovclient', 'tomcat'];
  var promises = [];
  services.forEach(function (serviceName) {
    promises.push(startService(serviceName));
  });
  return Promise.all(promises);
}

/**
 *
 * @param serviceName
 * @returns {*}
 */
function startService(serviceName) {
  var taskName = 'start service' + serviceName;
  return new Promise(function (resolve, reject) {
    spawn('./runservice.sh', [serviceName], {cwd: config.scriptFolder})
      .progress(function (childProcess) {
        console.log('[spawn] childProcess.pid: ', childProcess.pid);
        childProcess.stdout.on('data', function (data) {
          console.log(taskName, data.toString());
        });
        childProcess.stderr.on('data', function (data) {
          //TODO: when program reach this line??? should we reject here
          reject();
          console.log(taskName, data.toString());
        });
      })
      .then(function () {
        console.log(taskName, ' done!');
        resolve();
      })
      .fail(function (err) {
        console.error(taskName, ' ERROR: ', err);
        reject();
      });
  });
}

function startListOfServices(services) {
  if (!services || !services.length) {
    console.log('startListOfServices: empty service list', services);
    return;
  }
  var promises = [];
  services.forEach(function (serviceName) {
    promises.push(startService(serviceName));
  });
  return Promise.all(promises);
}

/**
 *
 */
function startCustomService() {
  var services = ['hsqldb', 'dal', 'masterpoller', 'workerpoller', 'scheduler', 'vlan'];
  return startListOfServices(services);
}

/**
 *
 * @returns {*}
 */
function setJavaToolOptions() {
  if (isLinux()) {
    return exec('echo $JAVA_TOOL_OPTIONS')
      .then(function (childProcess) {
        var result = childProcess.stdout;
        console.log('echo $JAVA_TOOL_OPTIONS', result);
        if (!result) {
          return exec('export JAVA_TOOL_OPTIONS=-Dfile.encoding=iso8859_1');
        }
      });
  } else {
    return Promise.resolve();
  }
}

function getConfig() {
  return new Promise(function(resolve, reject){
    fs.readFile('./config.json', 'utf8', function (err, jsonContent) {
      if(err){
        reject(err);
      }
      var config;
      try {
        config = JSON.parse(jsonContent);
        resolve(config);
      }catch (err){
        reject(err);
      }
    });

  });

}
// getConfig().then(function(json){
//   console.log(json);
// });
/**
 * determine operation system
 * @returns {boolean}
 */
function isLinux() {
  return os.platform() === 'linux';
}
