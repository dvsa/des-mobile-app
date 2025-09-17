import {AuthResult} from '@ionic-enterprise/auth';

export type UserInfoStateModel = {
  authResult: AuthResult;
  employeeName: string;
  employeeId: string;
};
