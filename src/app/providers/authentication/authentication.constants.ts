export enum AuthenticationError {
  NO_INTERNET = 'The Internet connection appears to be offline.',
  USER_CANCELLED = 'The operation couldn’t be completed. '
    + '(com.apple.AuthenticationServices.WebAuthenticationSession error 1.). (null)',
  NO_RESPONSE = 'application did not receive response from broker',
  USER_NOT_AUTHORISED = 'User is not authorized to access this message with an explicit deny',

  USER_CANCELLED_AUTH = 'user canceled auth',

  // Triggers when clicking `Back` button on list of accounts
  CALLBACK_URL_NO_CODE_PARAM = 'authentication error: callback url has no code param',

  USER_DECIDED_NOT_TO_CONTINUE_AUTH = 'The user decided not to continue the authentication',
}
