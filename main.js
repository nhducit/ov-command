var program = require('commander');
var commands = require('./commands');


program
  .version('0.1.0');

program
  .command('build [mode]')
  .description('run setup commands for all envs')
  // .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(mode/*, options*/){
    // var mode = options.setup_mode || "normal";
    var _mode = mode || 'all';
    commands.getBuildFn(_mode);
  });

program
  .command('start <mode>')
  // .alias('ex')
  .description('execute the given remote cmd')
  // .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(mode, options){
    var _mode = mode || 'default';
    commands.getStartServiceFn(_mode);
  });

program.parse(process.argv);
