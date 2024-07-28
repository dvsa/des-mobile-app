import { TestSlot } from '@dvsa/mes-journal-schema';

export interface DelegatedExaminerTestSlot extends TestSlot {
  examinerId: number;
}

export function mockGetDelegatedBooking(): any {
  return {
    examinerId: 4583912,
    testSlot: {
      testCentre: {
        centreId: 1,
        centreName: 'test centre',
        costCode: 'cost code',
      },
      slotDetail: {
        slotId: '35294119',
        start: '2020-09-17T08:00:00',
      },
      vehicleTypeCode: 'V4',
      vehicleSlotTypeCode: '122',
      booking: {
        candidate: {
          candidateId: 1,
          driverNumber: 'RED99808065W97NM',
          dateOfBirth: '1985-08-06',
          candidateName: {
            firstName: 'Dele',
            lastName: 'Gated-Exam',
          },
        },
        application: {
          applicationId: '24306741',
          bookingSequence: 1,
          checkDigit: 0,
          testCategory: 'CCPC',
        },
      },
    },
  };
}
