module.exports = {
  getStartServiceFn: getStartServiceFn,
  getBuildFn: getBuildFn
};
var build = require('./build');
var startService = require('./startService');

var buildMap = {
  all: build.build,
  ant: build.buildAnt,
  ov2500: build.buildOvCode
};

var startServiceMap = {
  default: startService.startDefaultService,
  custom: startService.startDefaultService
};

function getStartServiceFn(type) {
  (startServiceMap[type] || function () {
    if (type !== true) {
      console.log('Start service type argument is not supported: ', type);
    }
  })();
}

function getBuildFn(type) {
  (buildMap[type] || function () {
    if (type !== true) {
      console.log('Build TYPE argument is not supported: ', type);
    }
  })();
}