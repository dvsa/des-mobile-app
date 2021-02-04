# DES-MOBILE-APPLICATION
DVSA Driving Examiner Application

### Pre-requisites

- Node
- npm
- Ionic CLI: `npm install -g ionic`
- Capacitor `npm install @capacitor/core @capacitor/cli` May need to be installed globally (with sudo)
- Cocoapods `brew install cocoapods`
- Security
  - [Git secrets](https://github.com/awslabs/git-secrets)
  - [ScanRepo](https://github.com/UKHomeOffice/repo-security-scanner)
    - latest version: scanrepo-0.4.0-darwin-amd64.tar.gz
    - Add to path (using echo $PATH to find your path)
- NOTE: you wil need to obtain `ionic-config.json` and `.npmrc` files containing the ionic enterprise licence keys and save to the project root in order to build the app.

### Get started

Run the following commands after cloning the project
- `npm i`
- `ionic build`
- `ionic cap add ios`
- `ionic cap copy ios`
- `npm run copy-resources`

### Config

Run the following to switch between configurations
- `npm run config:dev` (access dev services)
- `npm run config:local`

### Running Application

- For simulator (this will open xcode where you can select your device and click play)
  - `ionic cap open ios`
  - OR
  - `ionic cap run ios -l --external` 
- For browser (open in default browser using local data)
  - `npm run serve:local`

### Accessing NGRX state

- Browser: Open ReduxDevTools
- Simulator: TBC

### Unit Test suite

- `npm run test`
