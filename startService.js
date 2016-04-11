var Promise = require('bluebird');
var fs = require('fs');
var _ = require('lodash');
var spawn = require('child-process-promise').spawn;
var exec = require('child-process-promise').exec;
//
var config = require('./ovConfig');
var logger = require('./logger');
//

//

module.exports = {
  service: startService,
  list: startListOfServices,
  default: startDefaultGroup,
  group: startGroup
};


function startDefaultGroup() {
  return startGroup('default');
}

/**
 *
 * @param serviceName
 * @returns {*}
 */
function startService(serviceName) {
  var taskName = 'start service' + serviceName;
  return new Promise(function (resolve, reject) {
    spawn('./runservice.sh', [serviceName], {cwd: config.env.scriptFolder})
      .progress(function (childProcess) {
        console.log('[spawn] childProcess.pid: ', childProcess.pid);
        childProcess.stdout.on('data', function (data) {
          console.log(taskName, data.toString());
        });
        childProcess.stderr.on('data', function (data) {
          //TODO: when program reach this line??? should we reject here
          reject(data.toString());
          console.error(taskName, data.toString());
        });
      })
      .then(function () {
        console.log(taskName, ' done!');
        resolve();
      })
      .fail(function (err) {
        console.error(taskName, ' ERROR: ', err);
        reject(err);
      });
  });
}

function startListOfServices(services) {
  if (!_.isArray(services)) {
    console.log('startListOfServices: empty service list', services);
    return;
  }
  var promises = [];
  services.forEach(function (serviceName) {
    promises.push(startService(serviceName));
  });
  return Promise.all(promises);
}

function startGroup(groupName) {
  var services = config.serviceGroup[groupName];
  return startListOfServices(services)
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

/**
 * determine operation system
 * @returns {boolean}
 */
function isLinux() {
  return os.platform() === 'linux';
}
