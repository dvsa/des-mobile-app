#!/bin/sh

echo "
 ************************
    Sonar scan deploy
 ************************
"

# Obtain app version from config.xml
APP_VERSION=$(xmllint -xpath 'string(//*[local-name()="widget"]/@version)' config.xml)

# Update the project version by replacing the <version> with the value inside config.xml
sed -i "" "s/<version>/${APP_VERSION}/g" sonar-project.properties
