1. Use ts-patch to patch ts compiler to add more details in log messages such as - function name, line name and file name - https://www.npmjs.com/package/ts-patch#installation
   - "postinstall": "ts-patch install" --> postinstall script to always patch the typescript compiler available in node modules
