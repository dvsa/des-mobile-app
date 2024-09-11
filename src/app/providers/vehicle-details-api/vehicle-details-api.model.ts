import {MotStatusCodes} from '@shared/models/mot-status-codes';

export interface VehicleMOTDetails {
  registration: string;
  make: string;
  model: string;
  status: MotStatusCodes;
  expiryDate: string;
}

