import { TestBed } from '@angular/core/testing';
import { SchemaValidatorProvider } from '@providers/schema-validator/schema-validator';
import { RemoteConfig } from '@dvsa/mes-config-schema/remote-config';

describe('SchemaValidatorProvider', () => {
  let provider: SchemaValidatorProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        SchemaValidatorProvider,
      ],
    });

    provider = TestBed.inject(SchemaValidatorProvider);
  });

  describe('validateRemoteConfig', () => {
    it('should return true if the data is valid', async () => {
      expect(provider.validateRemoteConfig({
        approvedDeviceIdentifiers: [],
        role: 'LDTM',
        journal: {
          journalUrl: 'test',
          searchBookingUrl: 'test',
          delegatedExaminerSearchBookingUrl: 'test',
          autoRefreshInterval: 1,
          numberOfDaysToView: 1,
          daysToCacheJournalData: 1,
          allowTests: true,
          allowedTestCategories: [],
          testPermissionPeriods: [],
          enableTestReportPracticeMode: true,
          enableEndToEndPracticeMode: true,
          enableLogoutButton: true,
          enablePracticeModeAnalytics: true,
        },
        tests: {
          testSubmissionUrl: 'test',
          autoSendInterval: 1,
        },
        user: { findUserUrl: 'test' },
        requestTimeout: 1,
        employeeNameKey: 'test',
        googleAnalyticsId: 'test',
      } as RemoteConfig).valid)
        .toEqual(true);
    });
  });
});
