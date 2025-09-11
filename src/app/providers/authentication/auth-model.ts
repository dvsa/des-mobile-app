import { AuthResult } from '@ionic-enterprise/auth';

export interface TokenInfo {
  id: string;
  oid: string;
  employeeId: string;
  authResult: AuthResult;
}

export interface TokenStatus {
  active: boolean;
  action: string;
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
  sub: string;
  tid: string;
  uti: string;
  ver: string;
  employeeid?: string;
  employeeNameKey?: string;
  email?: string;
}
