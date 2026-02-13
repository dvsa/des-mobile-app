import { AuthResult } from '@providers/authentication/authentication';

export enum AuthenticationError {
  CREATE_CONTEXT = 'Unable to create context, check logs',
  OBTAIN_ACCESS = 'Unable to obtain access token',
  CREATE_BRIDGE_CONTROLLER = 'Unable to get Capacitor bridge.viewController',
  NOTHING_TO_SIGN_OUT_FROM = 'Nothing to sign-out from.',
  UNABLE_TO_LOGOUT = 'Unable to logout',
  INVALID_CLIENT_ID = 'Invalid client ID specified.',
  WRONG_AUTHORITY_TYPE = "authorityType must be one of 'AAD' or 'B2C' or 'CIAM'",
  USER_NOT_AUTHORISED = 'User is not authorized to access this message with an explicit deny',
  OFFLINE = 'User is offline',
}

export interface TokenInfo {
  id: string;
  testerName: string;
  testerEmail: string;
  testerRoles: string[];
  oid: string;
  employeeId: string;
  testerId: string;
  authResult: AuthResult;
}

export interface TokenStatus {
  active: boolean;
  action: string;
}

export interface AuthProviderSettings {
  context: string;
  resourceUrl: string;
  clientId: string;
  redirectUrl: string;
  logoutUrl: string;
  employeeIdKey: string;
  employeeNameKey: string;
}

export interface AzureIDToken {
  aio: string;
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  name: string;
  nbf: string;
  nonce: string;
  oid: string;
  preferred_username: string;
  rh: string;
  roles: string[];
  sub: string;
  tid: string;
  uti: string;
  ver: string;
  employeeid?: string;
  email?: string;
}
