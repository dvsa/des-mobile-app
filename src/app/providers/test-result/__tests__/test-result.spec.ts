import { TestBed } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TestResultProvider } from '../test-result';
import { FaultCountProvider } from '../../fault-count/fault-count';
import * as mocks from '../__mocks__/test-result-data.mock';

describe('TestResultCalculatorProvider', () => {
  const fifteenCategories: TestCategory[] = [
    TestCategory.B,
    TestCategory.F,
    TestCategory.G,
    TestCategory.H,
    TestCategory.K,
  ];

  const twelveCategories: TestCategory[] = [
    TestCategory.C,
    TestCategory.C1,
    TestCategory.C1E,
    TestCategory.CE,
    TestCategory.D,
    TestCategory.D1,
    TestCategory.DE,
    TestCategory.D1E,
  ];

  const adiCategories: TestCategory[] = [
    TestCategory.ADI2,
  ];

  const allCategories: TestCategory[] = [
    ...fifteenCategories,
    ...twelveCategories,
    ...adiCategories,
  ];
  let testResultProvider: TestResultProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        TestResultProvider,
        FaultCountProvider,
      ],
    });
  });

  beforeEach(() => {
    testResultProvider = TestBed.inject(TestResultProvider);
  });

  describe('calculateTestResult', () => {
    describe(`${allCategories.join(', ')}`, () => {
      allCategories.forEach((cat) => {
        it(`should return a Pass when there are no driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.noFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.PASS);
            done();
          });
        });
        it(`should return a Fail when a dangerous fault exists for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.dangerousFaultMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.FAIL);
            done();
          });
        });
        it(`should return a Fail when a serious fault exists for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.seriousFaultMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.FAIL);
            done();
          });
        });
      });
    });

    describe('ADI2', () => {
      adiCategories.forEach((cat) => {
        it(`should return a Fail when there are 7 driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.adi2SevenDrivingFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.FAIL);
            done();
          });
        });
        it(`should return a Fail when there are 7 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.adi2SevenDrivingFaultsWithDangerousMock)
            .subscribe((result) => {
              expect(result).toBe(ActivityCodes.FAIL);
              done();
            });
        });
        it(`should return a Fail when there are 7 driving faults and a serious fault for a Cat ${cat} test`,
          (done) => {
            testResultProvider.calculateTestResult(cat, mocks.adi2SevenDrivingFaultsWithSeriousMock)
              .subscribe((result) => {
                expect(result).toBe(ActivityCodes.FAIL);
                done();
              });
          });
        it(`should return a Fail when there are 6 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.adi2SixDrivingFaultsWithDangerousMock)
            .subscribe((result) => {
              expect(result).toBe(ActivityCodes.FAIL);
              done();
            });
        });
        it(`should return a Fail when there are 6 driving faults and a serious fault for a Cat ${cat} test`,
          (done) => {
            testResultProvider.calculateTestResult(cat, mocks.adi2SixDrivingFaultsWithSeriousMock)
              .subscribe((result) => {
                expect(result).toBe(ActivityCodes.FAIL);
                done();
              });
          });
        it(`should return a Pass when there are 6 driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.adi2SixDrivingFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.PASS);
            done();
          });
        });
        it(`should return a Fail when theres is a dangerous vehicle check for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.adi2DangerousVehicleCheckFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.FAIL);
            done();
          });
        });
      });
    });

    describe(`${fifteenCategories.join(', ')}`, () => {
      fifteenCategories.forEach((cat) => {
        it(`should return a Fail when there are 16 driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.sixteenDrivingFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.FAIL);
            done();
          });
        });
        it(`should return a Fail when there are 16 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.sixteenDrivingFaultsWithDangerousMock)
            .subscribe((result) => {
              expect(result).toBe(ActivityCodes.FAIL);
              done();
            });
        });
        it(`should return a Fail when there are 16 driving faults and a serious fault for a Cat ${cat} test`,
          (done) => {
            testResultProvider.calculateTestResult(cat, mocks.sixteenDrivingFaultsWithSeriousMock)
              .subscribe((result) => {
                expect(result).toBe(ActivityCodes.FAIL);
                done();
              });
          });
        it(`should return a Fail when there are 15 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.fifteenDrivingFaultsWithDangerousMock)
            .subscribe((result) => {
              expect(result).toBe(ActivityCodes.FAIL);
              done();
            });
        });
        it(`should return a Fail when there are 15 driving faults and a serious fault for a Cat ${cat} test`,
          (done) => {
            testResultProvider.calculateTestResult(cat, mocks.fifteenDrivingFaultsWithSeriousMock)
              .subscribe((result) => {
                expect(result).toBe(ActivityCodes.FAIL);
                done();
              });
          });
        it(`should return a Pass when there are 15 driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.fifteenDrivingFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.PASS);
            done();
          });
        });
      });
    });

    describe(`${twelveCategories.join(', ')}`, () => {
      twelveCategories.forEach((cat) => {
        it(`should return a Fail when there are 13 driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.thirteenDrivingFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.FAIL);
            done();
          });
        });
        it(`should return a Fail when there are 13 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.thirteenDrivingFaultsWithDangerousMock)
            .subscribe((result) => {
              expect(result).toBe(ActivityCodes.FAIL);
              done();
            });
        });
        it(`should return a Fail when there are 13 driving faults and a serious fault for a Cat ${cat} test`,
          (done) => {
            testResultProvider.calculateTestResult(cat, mocks.thirteenDrivingFaultsWithSeriousMock)
              .subscribe((result) => {
                expect(result).toBe(ActivityCodes.FAIL);
                done();
              });
          });
        it(`should return a Fail when there are 12 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.twelveDrivingFaultsWithDangerousMock)
            .subscribe((result) => {
              expect(result).toBe(ActivityCodes.FAIL);
              done();
            });
        });
        it(`should return a Fail when there are 12 driving faults and a serious fault for a Cat ${cat} test`,
          (done) => {
            testResultProvider.calculateTestResult(cat, mocks.twelveDrivingFaultsWithSeriousMock)
              .subscribe((result) => {
                expect(result).toBe(ActivityCodes.FAIL);
                done();
              });
          });
        it(`should return a Pass when there are 12 driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.twelveDrivingFaultsMock).subscribe((result) => {
            expect(result).toBe(ActivityCodes.PASS);
            done();
          });
        });
      });
    });
  });
});
