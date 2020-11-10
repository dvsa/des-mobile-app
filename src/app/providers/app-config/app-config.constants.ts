export enum AppConfigError {
  UNKNOWN_ERROR = 'error getting remote config',
  MDM_ERROR = 'error getting mobile device management config',
  MISSING_REMOTE_CONFIG_URL_ERROR = 'error getting remote config url from mobile device management config',
  INVALID_APP_VERSION = 'Current app version is below the minimum required app version',
  VALIDATION_ERROR = 'invalid remote config schema',
}
