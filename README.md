# DES Mobile App

DVSA Driving Examiner Application

![CI Checks](https://github.com/dvsa/des-mobile-app/actions/workflows/ci.yaml/badge.svg)
![Snyk Security](https://github.com/dvsa/des-mobile-app/actions/workflows/security.yaml/badge.svg)

### Pre-requisites

- NodeJS - We are using [n](https://github.com/tj/n) to manage our version. Please see `.nvmrc` for specific version
- NPM (If using [n](https://github.com/tj/n), your `npm` version will be automatically managed)
- Brew
- Cocoapods (Recommend installing via Homebrew using `brew install cocoapods`)
- Security
  - [Git secrets](https://github.com/awslabs/git-secrets)
  - [ScanRepo](https://github.com/UKHomeOffice/repo-security-scanner)
    - Unzip `repo-security-scanner_<version>_Darwin_<architercture>.tar.gz` and rename the executable inside the folder
      to `scanrepo` - Add executable to path (using `echo $PATH` to find your path)

- NOTE: You wil need to obtain `ionic.config.json` and `.npmrc` files containing secrets and save to the
  project root in order to build the app.

### Get started

###### Run the following commands after cloning the project

1. `npm install` (or `npm i`)
2. `npm run build`

### Standalone components

Components, directives, and pipes use Angular's standalone default and declare their template dependencies
in their own `imports`. Import them directly rather than creating component NgModules.
Root routes are defined in `src/app/app.routes.ts` and registered with `provideRouter()` in `src/main.ts`,
alongside the application providers.

### Config

###### Run the following to switch between configurations

- `npm run config:dev`
- `npm run config:local`

### Running Application

- For simulator/device (A list of devices will be displayed based on Xcode installations)
  - `npm run serve:emulator`
- For browser (Opens in default browser using data from `./mocks/generate-local-*.ts` files)
  - `npm run serve:local`

### Accessing NGRX state

###### The Redux DevTools extension can be installed via Chrome Web Store

#### Browser:

- Open ReduxDevTools

#### Simulator:

1. In one terminal: `npm run remote-devtools-server`
2. In another: `npm run serve:devtools`
3. Open remote devtools from ReduxDevTools Chrome extension
4. Open `settings` (first use only) and set option for `Use custom (local) server`. `Host name: localhost Port: 8000`

### Unit Tests

The complete unit test suite runs with Vitest through Angular's `@angular/build:unit-test`
builder, using jsdom rather than a headless Chrome process.

```shell
npm run test
npm run test:reload
npm run test:fast
```

`test` and `test:reload` prepare mock data and the development environment first. `test` runs once with
coverage; `test:reload` watches for changes without coverage. `test:fast` skips preparation and
coverage for local iteration, so run `npm test` first if mock data or the environment needs preparing.
CI runs the same `npm run test` command.
HTML, LCOV, and summary coverage reports are written to `coverage/vitest`.

To run tests without regenerating mock data or replacing the environment file:

```shell
npx ng test --watch=false --progress=false --coverage=false
```

Standalone tests must configure their own dependencies; application bootstrap providers are not inherited.
Use `provideBasePageMocks()` from `mock/test-providers.ts` for page dependencies, or
`provideTestTranslations()` for translation-only components. Configure a root store or `provideMockStore()`
separately, and include directives in standalone test host components' `imports`.

To run a single spec:

```shell
npx ng test --watch=false --coverage=false --include=src/store/journal/__tests__/journal.selector.spec.ts
```

Specs and shared mocks use native Vitest APIs. `vi.spyOn()` calls the original implementation
unless explicitly stubbed; use `mockReturnValue`, `mockResolvedValue`, or `mockImplementation`
when the real method must not run. Await asynchronous assertions, use `firstValueFrom` for
single observable emissions, and restore Vitest fake timers in `finally` blocks.
Angular 21's Zone-based `fakeAsync`, `tick`, and `waitForAsync` are not used in this suite.

Angular initializes TestBed automatically. `src/test-setup.vitest.ts` registers icons, browser
Buffer/global shims, IndexedDB emulation, and the existing `detectChanges(false)` default.
Tests run in isolated environments; mock cleanup and timeouts are configured in `vitest.config.ts`.
The runner uses a thread pool capped at eight workers (or the available CPU count on smaller
machines) to limit contention while retaining test isolation.
Translation tests load the real English/Welsh JSON through `provideTestTranslations()` in
`mock/test-providers.ts`, without HTTP requests.
Four legacy spec files containing only commented-out tests are explicitly excluded in
`angular.json`; no active tests are excluded. Existing skipped tests remain skipped.

### Sentry

###### In order to manually create a Sentry release, you should obtain the `.sentryclirc` file and place at root

- A script has been added (`buildScripts/sentry-deploy.sh`) that will automatically create a new Sentry release and
  upload sourcemaps
- If wishing to disable Sentry for any reason, then set the `dsn` value to null in the env file

### Code style

- This project uses [husky](https://github.com/typicode/husky) to run a series of checks on `pre-commit` and `pre-push`
- This project uses `biome` to enforce code styles/standards.  Plugins are available for code editors such as webstorm and vscode

###### Use the following to trigger a code wide review.
- - `npm run lint`
- - `npm run lint:fix`
