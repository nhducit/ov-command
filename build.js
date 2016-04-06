var Promise = require('bluebird');
var del = require('del');
var spawn = require('child-process-promise').spawn;
//
var config = require('./config');
var logger = require('./logger');
//

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
  return del(['logs/' + fileName]).then(function (paths) {
    console.log('Deleted files and folders:\n', paths.join('\n'));
  });
}

/**
 *
 */
function buildAnt() {
  var ant = 'ant -f release.xml buildinstallers:';
  return deleteLogFile('ant.log')
    .then(function () {
      return new Promise(function (resolve, reject) {
        spawn('ant', ['-f', 'release.xml', 'buildinstallers'], {cwd: config.antFolder})
          .progress(function (childProcess) {
            logger.ant.info('[spawn] childProcess.pid: ', childProcess.pid);
            childProcess.stdout.on('data', function (data) {
              logger.ant.info(ant, data.toString());
            });
            childProcess.stderr.on('data', function (data) {
              reject('bkjdaskjbdkjasbdk');
              logger.ant.info(ant, data.toString());
            });
          })
          .then(function () {
            resolve();
            logger.ant.info(ant, ' done!');
          })
          .fail(function (err) {
            reject();
            logger.ant.error('[spawn] ERROR: ', err);
          });
      });
    });
}

/**
 *
 */
function buildOvCode() {
  var build2500 = 'Build code of OV2500 & NGNMS:';
  return deleteLogFile('ov2500.log').then(function () {
    return new Promise(function (resolve, reject) {
      spawn('mvn', ['clean', 'install', '-Dtest'], {cwd: config.ov2500Folder})
        .progress(function (childProcess) {
          logger.ov2500.info('[spawn] childProcess.pid: ', childProcess.pid);
          childProcess.stdout.on('data', function (data) {
            logger.ov2500.info(build2500, data.toString());
          });
          childProcess.stderr.on('data', function (data) {
            reject();
            logger.ov2500.info(build2500, data.toString());
          });
        })
        .then(function () {
          resolve();
          logger.ov2500.info(build2500, ' done!');
        })
        .fail(function (err) {
          reject();
          logger.ov2500.error(build2500, ' ERROR: ', err);
        });
    });
  });
}

/**
 *
 */
function buildStage() {
  var buildStageName = 'Build Stage';
  return deleteLogFile('stage.log').then(function () {
    return new Promise(function (resolve, reject) {
      spawn('mvn', ['clean', 'install'], {cwd: config.stageFolder})
        .progress(function (childProcess) {
          logger.stage.info('[spawn] childProcess.pid: ', childProcess.pid);
          childProcess.stdout.on('data', function (data) {
            logger.stage.info(buildStageName, data.toString());
          });
          childProcess.stderr.on('data', function (data) {
            reject();
            logger.stage.info(buildStageName, data.toString());
          });
        })
        .then(function () {
          resolve();
          logger.stage.info(buildStageName, ' done!');
        })
        .fail(function (err) {
          reject();
          logger.stage.error(buildStage, ' ERROR: ', err);
        });
    })
  });
}

/**
 *
 */
function build() {
  var promises = [buildAnt(), buildOvCode()];
  return Promise.all(promises).then(function (/*successData*/) {
    return buildStage().then(function () {
      startDefaultService();
    });
  });
}
/**
 * determine operation system
 * @returns {boolean}
 */
function isLinux() {
  return os.platform() === 'linux';
}
