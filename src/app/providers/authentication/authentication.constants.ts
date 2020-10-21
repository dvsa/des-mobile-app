export enum AuthenticationError {
  NO_INTERNET = 'The Internet connection appears to be offline.',
  USER_CANCELLED = 'User cancelled authentication flow',
  NO_RESPONSE = 'application did not receive response from broker',
  USER_NOT_AUTHORISED = 'user not authorised',
}
