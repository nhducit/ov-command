# Automatic build command for OV

## Usage:
- Configure setting and directory path in config.json file.
- run this command: "node main.js --help" for usage and 

## How it works?
- Spawn 2 child processes to trigger 2 build processes simultaneously, after 2 build processes are finish, trigger build "Stage" folder. Then start default services.

## Library:
- bluebird: a fully featured promise library
- commander: Provide command-line interface
- del: delete file and folder
- winston: logging information to files
- cli-spinner: command-line spinner