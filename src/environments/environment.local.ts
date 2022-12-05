import { ExaminerRole } from '@providers/app-config/constants/examiner-role.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { environment as devEnvironment } from '@environments/environment.dev';
import { LocalEnvironmentFile } from './models/environment.model';

export const environment: LocalEnvironmentFile = {
  // this is required by main.ts so that Ionic knows when to enable production mode
  ...devEnvironment,
  isRemote: false,
  enableDevTools: true,
  enableRehydrationPlugin: true,
  googleAnalyticsId: 'UA-129489007-3',
  employeeNameKey: 'name',
  approvedDeviceIdentifiers: [
    'iPad7,4',
    'x86_64',
  ],
  role: ExaminerRole.DE,
  journal: {
    journalUrl: '/assets/mock/local-journal.json',
    searchBookingUrl: 'dummy/search/booking/url',
    delegatedExaminerSearchBookingUrl: 'dummy/delegated-bookings/{applicationReference}',
    teamJournalUrl: '/assets/mock/local-test-centre-journal.json',
    autoRefreshInterval: 1000 * 60 * 10,
    numberOfDaysToView: 7,
    daysToCacheJournalData: 14,
    allowTests: true,
    allowedTestCategories: [
      // Cat ADI2
      TestCategory.ADI2,
      // Cat B
      TestCategory.B,
      // Cat BE
      TestCategory.BE,
      // Cat C
      TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E,
      TestCategory.CM, TestCategory.C1M, TestCategory.CEM, TestCategory.C1EM,
      // Cat D
      TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E,
      TestCategory.DM, TestCategory.D1M, TestCategory.DEM, TestCategory.D1EM,
      // Cat CPC
      TestCategory.CCPC, TestCategory.DCPC,
      // Cat Home
      TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
      // Cat Mod1
      TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1,
      // Cat Mod2
      TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2,
    ],
    enableTestReportPracticeMode: true,
    enableEndToEndPracticeMode: true,
    enableLogoutButton: true,
    testPermissionPeriods: [
      {
        testCategory: 'ADI2',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'ADI3',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'B',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'B+E',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'C',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'C1',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'C1+E',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'C+E',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'CCPC',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'DCPC',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUAM1',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUA1M1',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUA2M1',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUAMM1',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUAM2',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUA1M2',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUA2M2',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'EUAMM2',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'D',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'D1',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'D1+E',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'D+E',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'F',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'G',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'H',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'K',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'CM',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'C1M',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'C+EM',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'C1+EM',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'DM',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'D1M',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'D+EM',
        from: '2019-01-01',
        to: null,
      },
      {
        testCategory: 'D1+EM',
        from: '2019-01-01',
        to: null,
      },
    ],
  },
  tests: {
    testSubmissionUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/test-results',
    autoSendInterval: 900000,
  },
  user: {
    findUserUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/users/{staffNumber}',
  },
  driver: {
    signatureUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/driver/signature/{drivingLicenceNumber}',
    photographUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/driver/photograph/{drivingLicenceNumber}',
    standardUrl: 'https://dev.mes.dev-dvsacloud.uk/v1/driver/standard',
  },
  vehicle: {
    taxMotUrl: 'https://api.dvla.test.smc.dvsacloud.uk/1.0/vehicle',
  },
  requestTimeout: 20000,
};
