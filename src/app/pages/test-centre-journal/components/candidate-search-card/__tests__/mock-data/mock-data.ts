import { cloneDeep } from 'lodash';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { Examiner, TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';

const dummyTodayTestSlot = {
  slotDetail: {
    slotId: 1,
    start: '2021-03-01',
    duration: 25,
  },
} as TestSlot;

export const mockExaminerData: TestCentreDetailResponse = {
  staffNumber: '',
  examiners: [
    {
      name: 'Examiner One',
      staffNumber: '012345',
      journal: {
        advanceTestSlots: [],
        deployments: [],
        examiner: {
          staffNumber: '',
          individualId: 10000009,
        },
        nonTestActivities: [],
        testSlots: [
          {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
              },
              candidate: {
                candidateName: {
                  firstName: 'Florence',
                  lastName: 'Pearson',
                  title: 'Miss',
                },
              },
            },
            examinerVisiting: false,
            slotDetail: {},
            testCentre: {},
            vehicleSlotTypeCode: 7,
            vehicleTypeCode: 'C',
          },
        ],
      },
    },
  ],
  testCentres: [],
};

export const mockMultipleExaminerTestSlots: Examiner[] = [
  {
    name: 'Examiner One',
    staffNumber: '111111',
    journal: {
      testSlots: [
        {
          ...cloneDeep(dummyTodayTestSlot),
          booking: {
            candidate: {
              candidateName: {
                firstName: 'Joe',
                lastName: 'Bloggs',
              },
            },
          },
        },
        {
          ...cloneDeep(dummyTodayTestSlot),
          booking: {
            candidate: {
              candidateName: {
                firstName: 'Jane',
                lastName: 'Doe',
              },
            },
          },
        },
      ],
    },
  },
  {
    name: 'Examiner Two',
    staffNumber: '111111',
    journal: {
      testSlots: [
        {
          ...cloneDeep(dummyTodayTestSlot),
          booking: {
            candidate: {
              candidateName: {
                firstName: 'Joe',
                lastName: 'Bloggs',
              },
            },
          },
        },
      ],
    },
  },
];
