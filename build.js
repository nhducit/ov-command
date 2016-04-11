var Promise = require('bluebird');
var del = require('del');
var spawn = require('child-process-promise').spawn;
var Spinner = require('cli-spinner').Spinner;

//
var config = require('./ovConfig');
var logger = require('./logger');
//
var startService = require('./startService');
//

module.exports = {
  buildAnt: buildAnt,
  buildOvCode: buildOvCode,
  buildStage: buildStage,
  build: build
};

/**
 *
 * @param fileName
 * @returns {*}
 */
function deleteLogFile(fileName) {
  var spinner = getNewSpinner('Delete file: '+ fileName);
  spinner.start();
  return del(['logs/' + fileName])
    .then(function (paths) {
      spinner.stop();
      console.log('Deleted files and folders:\n', paths.join('\n'));
    });
}

/**
 *
 */
function buildAnt(hideSpinner) {
  var ant = 'Build ant folder';
  return deleteLogFile('ant.log')
    .then(function () {
      var spawnConfig = {
        logger: logger.ant,
        taskName: ant,
        hideSpinner: hideSpinner,
        command: {
          command: 'ant',
          args: ['-f', 'release.xml', 'buildinstallers'],
          cwd: config.env.antFolder
        }
      };
      return spawnCommand(spawnConfig);
    });
}

/**
 *
 */
function buildOvCode(hideSpinner) {
  var build2500 = 'Build OV Code:';
  return deleteLogFile('ov2500.log').then(function () {
    var spawnConfig = {
      logger: logger.ov2500,
      taskName: build2500,
      hideSpinner: hideSpinner,
      command: {
        command: 'mvn',
        args: ['clean', 'install', '-Dtest'],
        cwd: config.env.ov2500Folder
      }
    };
    return spawnCommand(spawnConfig);
  });
}

/**
 *
 */
function buildStage(hideSpinner) {
  var buildStageName = 'Build Stage folder';
  return deleteLogFile('stage.log').then(function () {
    var spawnConfig = {
      logger: logger.stage,
      taskName: buildStageName,
      hideSpinner: hideSpinner,
      command: {
        command: 'mvn',
        args: ['clean', 'install'],
        cwd: config.env.stageFolder
      }
    };
    return spawnCommand(spawnConfig);
  });
}

/**
 *
 * @param config
 */
function spawnCommand(config) {
  var logger = config.logger;
  var taskName = config.taskName;
  var command = config.command;
  var spinner = getNewSpinner(taskName);
  if (!config.hideSpinner) {
    spinner.start();
  }
  return new Promise(function (resolve, reject) {
    spawn(command.command, command.args || [], {cwd: command.cwd})
      .progress(function (childProcess) {
        logger.info('[spawn] childProcess.pid: ', childProcess.pid);
        childProcess.stdout.on('data', function (data) {
          logger.info(taskName, data.toString());
        });
        childProcess.stderr.on('data', function (data) {
          // reject(data.toString());
          logger.error(taskName, data.toString());
        });
      })
      .then(function () {

        spinner || spinner.stop || spinner.stop();
        logger.info(taskName, ' done!');
        resolve();
      })
      .fail(function (err) {
        spinner || spinner.stop || spinner.stop();
        logger.error(taskName, ' ERROR: ', err);
        reject(err);
      });
  });
}

/**
 *
 */
function build() {
  var spinner = getNewSpinner('Build ant folder, OV code and stage folder:');
  spinner.start();
  var promises = [buildAnt(true), buildOvCode(true)];
  return Promise.all(promises).then(function (/*successData*/) {

    return buildStage(true)
      .then(function () {
        return startService.defaultService();
      })
      .catch(function (errr) {
      })
      .then(function () {
        spinner.stop();
      })
      ;
  });
}
/**
 * determine operation system
 * @returns {boolean}
 */
function isLinux() {
  return os.platform() === 'linux';
}

function getNewSpinner(taskName) {
  var spinner = new Spinner(taskName + ' .. %s');
  spinner.setSpinnerString('|/-\\');
  return spinner;
}

// NOTE: event name is camelCase as per node convention
process.on("unhandledRejection", function (reason, promise) {
  console.log('unhandledRejection', reason);
  // See Promise.onPossiblyUnhandledRejection for parameter documentation
});

// NOTE: event name is camelCase as per node convention
process.on("rejectionHandled", function (promise) {
  console.log('rejectionHandled');
  // See Promise.onUnhandledRejectionHandled for parameter documentation
});