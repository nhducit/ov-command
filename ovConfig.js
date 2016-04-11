module.exports = {
  env: {
    antFolder: '/home/nhduc/omnivista/omnivista/release/ovnms-e-421',
    ov2500Folder: '/home/nhduc/omnivista/omnivista/ngnms/ovnms-e-421/src',
    stageFolder: '/home/nhduc/omnivista/omnivista/ngnms/ovnms-e-421/src/build/stage',
    scriptFolder: '/home/nhduc/omnivista/omnivista/ngnms/ovnms-e-421/src/build/tools/scripts',
  },
  serviceGroup: {
    default: [
      'mongodb',
      'activemq',
      'ovserver',
      'ovclient',
      'tomcat'
    ],
    custom: [],
    vlan: ['hsqldb', 'dal', 'masterpoller', 'workerpoller', 'scheduler', 'vlan']
  }
};

