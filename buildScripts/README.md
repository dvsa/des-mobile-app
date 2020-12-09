# Build process

## Run on device script

```shell
npm run device # installs the app on a device plugged in via USB.
```

## Pre-requisites

- XCode 10.0
- [ios-deploy](https://www.npmjs.com/package/ios-deploy)
- A provisioning profile on your Mac. This can be a personal iTunes account for local development (see below for instructions).
- Setup `build.json` as described below.

## Provisioning Profile

In order to create a provisioning profile for development, follow these steps:

1. Run `ionic cordova build ios` to generate an XCode project.
2. Open the workspace at `platforms/ios/Mobile Examiner.xcworkspace` with XCode.
3. In XCode, goto Preferences (`Cmd+comma`) -> Accounts => Add (plus symbol, dialog lower left) and sign in with your Apple ID.
4. Close the Preferences dialog. In the top left of the main XCode window select the icon that looks like a folder, then the project name.
5. Ensure your "Bundle Identifier" is unique (you can probably just suffix your initials).
6. Select a connected device in the top menu bar.
7. Go to `File` -> `Workspace Settings` and seting `Build System` to `Legacy Build System`.
8. Ensure "Automatically manage signing" is selected. In the "Team" dropdown, select your personal team. A Provisioning Profile should be populated.
9. Determine your `TeamIdentifier` in your provisioning profile (found at `~/Library/MobileDevice/Provisioning Profiles`).

## build.json

In this directory, create a `build.json` file containing the following:

```json
{
  "ios": {
    "development": {
      "codeSignIdentity": "iPhone Developer",
      "automaticProvisioning": true,
      "developmentTeam": "<YOUR-TEAM-ID>",
      "packageType": "development",
      "buildFlag": ["-UseModernBuildSystem=0"]
    },
    "release": {
      "codeSignIdentity": "iPhone Developer",
      "automaticProvisioning": true,
      "developmentTeam": "<YOUR-TEAM-ID>",
      "packageType": "development",
      "buildFlag": ["-UseModernBuildSystem=0"]
    }
  }
}
```

Populate your team ID by searching for `TeamIdentifier` in your provisioning profile (found at `~/Library/MobileDevice/Provisioning Profiles`).

## Release Profile

The release profile is not _yet_ configured to work with the production signing identity. This will come later on.
