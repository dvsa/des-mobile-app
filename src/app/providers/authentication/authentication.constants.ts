import { AuthResult } from '@ionic-enterprise/auth';

export enum AuthenticationError {
  NO_INTERNET = 'The Internet connection appears to be offline.',
  USER_CANCELLED = 'user canceled auth',
  NO_RESPONSE = 'application did not receive response from broker',
  USER_NOT_AUTHORISED = 'User is not authorized to access this message with an explicit deny',
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
