import { MotHistoryWithStatus } from '@providers/mot-history-api/mot-history-api.service';
import { MotStatusCodes } from '@providers/mot-history-api/mot-interfaces';

export const fakeMOTResults: {
  pass: MotHistoryWithStatus;
  fail: MotHistoryWithStatus;
  noDetails: MotHistoryWithStatus;
} = {
  pass: {
    status: '200',
    data: {
      registration: 'XX01VLD',
      make: 'Practice',
      model: 'Mode',
      status: MotStatusCodes.VALID,
      expiryDate: '31/12/9999',
    },
  },
  fail: {
    status: '200',
    data: {
      registration: 'XX01INV',
      make: 'Practice',
      model: 'Mode',
      status: MotStatusCodes.NOT_VALID,
      expiryDate: '01/01/0001',
    },
  },
  noDetails: {
    status: '200',
    data: {
      registration: 'XX01NDT',
      make: '-',
      model: '-',
      status: MotStatusCodes.NO_DETAILS,
      expiryDate: '01/01/0001',
    },
  },
};
