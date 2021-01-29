import { SearchResultTestSchema } from '@dvsa/mes-search-schema';

export const searchResultsMock: SearchResultTestSchema [] = [
  {
    activityCode: '1',
    applicationReference: 123456,
    category: 'B',
    costCode: 'abcd',
    testDate: '2019-06-24T09:00:00',
    driverNumber: 'ABC123EFG',
    candidateName: {
      firstName: 'Joe',
      lastName: 'Blogs',
      title: 'Mr',
    },
  },
  {
    activityCode: '2',
    applicationReference: 234567,
    category: 'B',
    costCode: 'mnbv',
    testDate: '2019-06-24T010:00:00',
    driverNumber: 'ABC123EFG',
    candidateName: {
      firstName: 'Alan',
      lastName: 'Smith',
      title: 'Mr',
    },
  },
];
