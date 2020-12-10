# DES-MOBILE-APPLICATION
DVSA Driving Examiner Application

### Pre-requisites

- Node
- npm
- Ionic CLI: `npm install -g ionic`
- Capacitor `npm install @capacitor/core @capacitor/cli`
- Cocoapods `brew install cocoapods`
- Security
  - [Git secrets](https://github.com/awslabs/git-secrets)
  - [ScanRepo](https://github.com/UKHomeOffice/repo-security-scanner)
    - latest version: scanrepo-0.4.0-darwin-amd64.tar.gz
    - Add to path (using echo $PATH to find your path)
- NOTE: you wil need to obtain `ionic-config.json` and `.npmrc` files containing the ionic enterprise licence keys and save to the project root in order to build the app.

### Get started

- `npm i`
- `npm run build`
- `ionic capacitor add ios`
- `ionic cap sync`todo
- For simulator `ionic cap run ios -l --external` this will open xcode where you can select your device and click play
- For browser `ionic serve`

### TODO

#### Config

- Environment file is currently configured for DES locally, needs to be replaced with app specific values and configured to use Mdm  
- 

#### Login

- Function validateDeviceType() needs to check that the device its running on is supported

#### Logout

- Function logout() in authentication.ts needs to reset state (if app will use a state manager)
