var program = require('commander');
var commands = require('./commands');


program
  .version('0.1.0');

program
  .command('build [mode]')
  .description('Build OV')
  // .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(mode/*, options*/){
    // var mode = options.setup_mode || "normal";
    var _mode = mode || 'all';
    commands.getBuildFn(_mode);
  });

program
  .command('startGroup [mode]')
  // .alias('start')
  .description('Start defined group of service based config.js file')
  // .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(mode, options){
    var _mode = mode || 'default';
    console.log(mode);
    commands.getStartServiceFn(_mode);
  });

var serviceList = ['activemq','ag','analytics','av', 'byod',
  'dal','ftp','hsqldb','log','masterpoller',
'mdns','mongodb','openldap','ovclient','ovserver',
'phantomjs','redis','resourcemanager','scheduler','sip',
'tomcat','vlan','vmmanager','vxlan','wireless',
'workerpoller'
];

program
  .command('start <service> [otherServices...]')
  .description('Start list of services: ' + serviceList.join(', '))
  .action(function (service, otherServices) {
    var services = [service];
    if (otherServices) {
      otherServices.forEach(function (oService) {
        services.push(oService);
      });
    }
    commands.startServiceList(services);
  });

program.parse(process.argv);
