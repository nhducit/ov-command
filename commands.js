var build = require('./build');
var _ = require('lodash');
var startService = require('./startService');

module.exports = {
  getStartServiceFn: getStartServiceFn,
  startServiceList: startServiceList,
  getBuildFn: getBuildFn
};

var buildMap = {
  all: build.build,
  ant: build.buildAnt,
  stage: build.buildStage,
  ov: build.buildOvCode
};

function getStartServiceFn(type) {
  startService.group(type);
}

function startServiceList(serviceList) {
  if (_.isArray(serviceList)) {
    startService.list(serviceList)
  } else {
    console.log('startServiceList: args is not an array', serviceList);
  }
}

function getBuildFn(type) {
  (buildMap[type] || function () {
    if (type !== true) {
      console.log('Build TYPE argument is not supported: ', type);
    }
  })();
}
