# DES-MOBILE-APPLICATION

DVSA Driving Examiner Application

### Pre-requisites

- NodeJS
- NPM
- Brew
- Cocoapods `brew install cocoapods`
- Security
  - [Git secrets](https://github.com/awslabs/git-secrets)
  - [ScanRepo](https://github.com/UKHomeOffice/repo-security-scanner)
    - Unzip `repo-security-scanner_<version>_Darwin_<architercture>.tar.gz` and rename the executable inside the folder
      to `scanrepo` - Add executable to path (using `echo $PATH` to find your path)

- NOTE: You wil need to obtain `ionic.config.json` and `.npmrc` files containing secrets and save to the
  project root in order to build the app.

### Get started

###### Run the following commands after cloning the project

1. `npm i`
2. `npm run build`

### Config

###### Run the following to switch between configurations

- `npm run config:dev` (access dev services)
- `npm run config:local`

### Running Application

- For simulator/device (Terminal should prompt you to a target which includes a connected device or Simulators from
  XCode)
  - `npm run serve:emulator`
- For browser (Opens in default browser using local data)
  - `npm run serve:local`

### Accessing NGRX state

#### Browser:

- Open ReduxDevTools

#### Simulator:

1. In one terminal: `npm run remote-devtools-server`
2. In another: `npm run serve:devtools`
3. Open remote devtools from ReduxDevTools Chrome extension
4. Open `settings` (first use only) and set option for `Use custom (local) server`. `Host name: localhost Port: 8000`

### Unit Tests

###### Running the following command will create a folder containing code coverage here `./coverage`.

- `npm run test`

### Sentry

###### In order to manually create a Sentry release, you should obtain the `.sentryclirc` file and place at root

- A script has been added (`buildScripts/sentry-deploy.sh`) that will automatically create a new Sentry release and
  upload sourcemaps
- If wishing to disable Sentry for any reason, then set the `dsn` value to null

### Sonar

###### In order to upload latest code to Sonar, you should obtain the `sonar-project.properties` file and place at root

- A script has been added (`buildScripts/sonar-properties-update.sh`) that will update the version of the Sonar release
  based upon the version contained inside `config.xml`
- Execute `npm run sonar` to ensure all necessary files are checked
