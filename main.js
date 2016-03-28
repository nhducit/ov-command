var program = require('commander');
var lib = require('./lib');

program
  .version('0.0.1')
  .option('-d, --startDefaultService', 'Start default service')
  .option('-c, --startCustomService', 'Start default service')
  .option('-b, --buildAll', 'Build All')
  .option('-a, --buildAnt', 'Build Ant')
  .option('-o, --buildOv2500', 'Build Ant')
  .option('-m --startService <size>', 'Start service', /^(large|medium|small)$/i, 'medium')
  .parse(process.argv);

console.log('exec command:');
if (program.startDefaultService) {
  lib.startDefaultService();
}
if (program.startCustomService) {
  lib.startCustomService();
}
if (program.buildAll) {
  lib.build();
}

if (program.buildAnt) {
  lib.buildAnt();
}

if (program.buildOv2500) {
  lib.buildOvCode();
}