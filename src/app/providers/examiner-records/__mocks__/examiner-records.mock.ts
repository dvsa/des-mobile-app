import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ColourEnum, ColourScheme, SelectableDateRange } from '@providers/examiner-records/examiner-records';
import moment from 'moment/moment';

export class ExaminerRecordsProviderMock {

  public colours: {
    default: ColourScheme,
    greyscale: ColourScheme,
  } = {
    default: {
      name: ColourEnum.DEFAULT,
      pie: [
        '#008FFB',
        '#ED6926',
        '#FF526F',
        '#007C42',
        '#a05195',
      ],
      bar: ['#008FFB'],
      emergencyStop: [
        '#ED6926',
        '#777777'
      ],
      average: '#000000',
    },
    greyscale: {
      name: ColourEnum.GREYSCALE,
      pie: ['#474747',
        '#5A5A5A',
        '#6E6E6E',
        '#818181',
        '#949494',
      ],
      bar: ['#777777'],
      average: '#000000',
    },
  };

  public localFilterOptions: SelectableDateRange[] = [
    {
      display: 'Today',
      val: 'today',
    },
    {
      display: 'Last 7 days',
      val: 'week',
    },
    {
      display: 'Last 14 days',
      val: 'fortnight',
    },
  ];
  public onlineFilterOptions: SelectableDateRange[] = [
    {
      display: 'Last 90 days',
      val: '90 days',
    },
    {
      display: 'Last 1 year',
      val: '1 year',
    },
    {
      display: 'Last 18 months',
      val: '18 months',
    },
  ]

  getRangeDate = jasmine.createSpy('getRangeDate').and.returnValue(moment(new Date()))

  handleLoadingUI = jasmine.createSpy('handleLoadingUI')

  formatForExaminerRecords = jasmine.createSpy('formatForExaminerRecords')
    .and
    .returnValue({
      appRef: 1,
      testCategory: TestCategory.B,
      testCentre: {
        centreId: 1,
        costCode: 'testCode',
        centreName: 'testName'
      },
      startDate: '01-01-01',
      routeNumber: 1,
      controlledStop: true,
      independentDriving: 'Sat nav',
      circuit: 'Left',
      safetyQuestions: [{
        code: 'code',
        description: 'description',
        outcome: 'P',
      }],
      balanceQuestions: [{
        code: 'code',
        description: 'description',
        outcome: 'P',
      }],
      manoeuvres: null,
      showMeQuestions: [{
        code: 'code',
        description: 'description',
        outcome: 'P',
      }],
      tellMeQuestions: [{
        code: 'code',
        description: 'description',
        outcome: 'P',
      }],
    });
}
