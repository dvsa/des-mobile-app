# DES-MOBILE-APPLICATION

DVSA Driving Examiner Application

### Pre-requisites

- Node (Using version specified in `.nvmrc`)
- NPM (Using version specified in `.npm-version`)
- Cordova (ionic-enterprise edition): `npm install -g @ionic-enterprise/cordova` (need to uninstall any other globally
  installed versions)
- Ionic CLI: `npm install -g @ionic/cli`
- Capacitor `npm install @capacitor/core @capacitor/cli` May need to be installed globally (with sudo)
- Cocoapods `brew install cocoapods`
- Security
  - [Git secrets](https://github.com/awslabs/git-secrets)
  - [ScanRepo](https://github.com/UKHomeOffice/repo-security-scanner)
    - Unzip `repo-security-scanner_<version>_Darwin_<architercture>.tar.gz` and rename the executable inside the folder
      to `scanrepo` - Add executable to path (using `echo $PATH` to find your path)

- NOTE: You wil need to obtain `ionic.config.json`, `.npmrc` and `.sentryclirc` files containing secrets and save to the
  project root in order to build the app.

### Get started

Run the following commands after cloning the project

- `npm i`
- `ionic build`
- `ionic cap sync`

### Config

Run the following to switch between configurations

- `npm run config:dev` (access dev services)
- `npm run config:local`

### Running Application

- For simulator (this will open xcode where you can select your device and click play)
  - `npm run serve:emulator`
- For browser (open in default browser using local data)
  - `npm run serve:local`

### Accessing NGRX state

#### Browser:

- Open ReduxDevTools

#### Simulator:

- In one terminal: `npm run remote-devtools-server`
- In another: `npm run serve:devtools`
- Open remote devtools from redux devtools Chrome extension
- Open `settings` (first use only) and set option for `Use custom (local) server`. `Host name: localhost Port: 8000`

### Unit Test suite

- `npm run test`

This will also create a code coverage report which can be found in the `/coverage` folder.

### Sentry

- A script has been added (`buildScripts/sentry-deploy.sh`) that will automatically create a new Sentry release and
  upload sourcemaps
- If wishing to disable Sentry for any reason, then set the `dsn` value to null
