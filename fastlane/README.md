fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

### build_ipa

```sh
[bundle exec] fastlane build_ipa
```



### build_sim

```sh
[bundle exec] fastlane build_sim
```



### clean

```sh
[bundle exec] fastlane clean
```

Clean Previous Build Folders

### update_project_id

```sh
[bundle exec] fastlane update_project_id
```

Update the bundle id to allow multiple environments of the same application

### sync_certs

```sh
[bundle exec] fastlane sync_certs
```

Synchronise the Apple Developer Certificates to the Temporary Keychain

### generate_qr

```sh
[bundle exec] fastlane generate_qr
```

Generate QR Code for artifact

### deploy

```sh
[bundle exec] fastlane deploy
```

Upload to S3 Bucket

### build_simulator

```sh
[bundle exec] fastlane build_simulator
```

Build the Simulator Build for the Automation Suite

### build_mobile

```sh
[bundle exec] fastlane build_mobile
```

Build the Application for Deployment

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
