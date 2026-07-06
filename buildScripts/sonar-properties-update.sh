#!/bin/sh


# Obtain app version from config.xml
APP_VERSION=$(xmllint -xpath 'string(//*[local-name()="widget"]/@version)' config.xml)
