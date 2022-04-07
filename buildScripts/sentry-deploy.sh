#!/bin/sh

echo "
      ************************
      Starting Sentry deploy!
      ************************
"

# Sentry project name
SENTRY_PROJECT=$(cat .sentryclirc | grep 'project' | cut -d = -f 2)

# Sentry project short code - not actually used by Sentry
SENTRY_PROJECT_SHORTCODE=$(cat .sentryclirc | grep 'project_shortcode' | cut -d = -f 2)

# Obtain app version from config.xml
APP_VERSION=$(xmllint -xpath 'string(//*[local-name()="widget"]/@version)' config.xml)

# Create new release
sentry-cli releases new -p $SENTRY_PROJECT "$SENTRY_PROJECT_SHORTCODE@$APP_VERSION"

# Associate commits
sentry-cli releases set-commits "$SENTRY_PROJECT_SHORTCODE@$APP_VERSION" --auto

# Upload source maps
sentry-cli releases files "$SENTRY_PROJECT_SHORTCODE@$APP_VERSION" upload-sourcemaps ./www --rewrite --validate --dist $APP_VERSION

# Finalise release
sentry-cli releases finalize "$SENTRY_PROJECT_SHORTCODE@$APP_VERSION"
