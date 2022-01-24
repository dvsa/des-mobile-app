#!/bin/sh
echo "Set version to: $1"
node buildScripts/set-config-version.js
cd ios/App
xcrun agvtool new-marketing-version $1
xcrun agvtool new-version -all $1
