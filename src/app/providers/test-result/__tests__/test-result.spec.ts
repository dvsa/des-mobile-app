import { TestBed, waitForAsync } from '@angular/core/testing';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ActivityCodes } from '@shared/models/activity-codes';
import { TestData as TestDataCPC } from '@dvsa/mes-test-schema/categories/CPC';
import { TestData as TestDataADI3 } from '@dvsa/mes-test-schema/categories/ADI3';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
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
  let faultCountProvider: FaultCountProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        TestResultProvider,
        FaultCountProvider,
      ],
    });

    testResultProvider = TestBed.inject(TestResultProvider);
    faultCountProvider = TestBed.inject(FaultCountProvider);
  }));

  describe('calculateTestResult', () => {
    [TestCategory.CM,
      TestCategory.C1M,
      TestCategory.CEM,
      TestCategory.C1EM,
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.DEM,
      TestCategory.D1EM].forEach((cat) => {
      it(`should call calculateCatCPCTestResult if testCategory is ${cat}`, () => {
        spyOn<any>(testResultProvider, 'calculateCatManoeuvreTestResult');
        testResultProvider.calculateTestResult(cat, null);
        expect(testResultProvider['calculateCatManoeuvreTestResult'])
          .toHaveBeenCalled();
      });
    });

    [TestCategory.EUAM1,
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAMM1].forEach((cat) => {
      it(`should call calculateCatEUAM1AndSubCategoryTestResult if testCategory is ${cat}`, () => {
        spyOn<any>(testResultProvider, 'calculateCatEUAM1AndSubCategoryTestResult');
        testResultProvider.calculateTestResult(cat, null);
        expect(testResultProvider['calculateCatEUAM1AndSubCategoryTestResult'])
          .toHaveBeenCalled();
      });
    });

    [TestCategory.EUAM2,
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAMM2].forEach((cat) => {
      it(`should call calculateCatEUAM2AndSubCategoryTestResult if testCategory is ${cat}`, () => {
        spyOn<any>(testResultProvider, 'calculateCatEUAM2AndSubCategoryTestResult');
        testResultProvider.calculateTestResult(cat, null);
        expect(testResultProvider['calculateCatEUAM2AndSubCategoryTestResult'])
          .toHaveBeenCalled();
      });
    });

    [TestCategory.CCPC,
      TestCategory.DCPC].forEach((cat) => {
      it(`should call calculateCatCPCTestResult if testCategory is ${cat}`, () => {
        spyOn<any>(testResultProvider, 'calculateCatCPCTestResult');
        testResultProvider.calculateTestResult(cat, null);
        expect(testResultProvider['calculateCatCPCTestResult'])
          .toHaveBeenCalled();
      });
    });

    describe(`${allCategories.join(', ')}`, () => {
      allCategories.forEach((cat) => {
        it(`should return a Pass when there are no driving faults for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.noFaultsMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.PASS);
              done();
            });
        });
        it(`should return a Fail when a dangerous fault exists for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.dangerousFaultMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
        it(`should return a Fail when a serious fault exists for a Cat ${cat} test`, (done) => {
          testResultProvider.calculateTestResult(cat, mocks.seriousFaultMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
      });
    });
  });

  describe('calculateCatManoeuvreTestResult', () => {
    it('should return FAIL if getDangerousFaultSumCount returns more than 0', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(1);

      testResultProvider['calculateCatManoeuvreTestResult'](TestCategory.B, {})
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if getSeriousFaultSumCount returns more than 0', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(1);

      testResultProvider['calculateCatManoeuvreTestResult'](TestCategory.B, {})
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if getSeriousFaultSumCount and getDangerousFaultSumCount return 0', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(0);

      testResultProvider['calculateCatManoeuvreTestResult'](TestCategory.B, {})
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.PASS);
          },
        );
    });
  });

  describe('calculateCatEUAM1AndSubCategoryTestResult', () => {
    it('should return FAIL_PUBLIC_SAFETY if getSpeedRequirementNotMet returns true', () => {
      testResultProvider['calculateCatEUAM1AndSubCategoryTestResult'](TestCategory.B, {
        emergencyStop: { outcome: CompetencyOutcome.S },
      })
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL_PUBLIC_SAFETY);
          },
        );
    });
    it('should return FAIL if getDangerousFaultSumCount returns more than 0', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(1);

      testResultProvider['calculateCatEUAM1AndSubCategoryTestResult'](TestCategory.B, {
        emergencyStop: { outcome: null },
      })
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if getSeriousFaultSumCount returns more than 0', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(1);

      testResultProvider['calculateCatEUAM1AndSubCategoryTestResult'](TestCategory.B, {
        emergencyStop: { outcome: null },
      })
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if getDrivingFaultSumCount returns 6 or more', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getDrivingFaultSumCount')
        .and
        .returnValue(6);

      testResultProvider['calculateCatEUAM1AndSubCategoryTestResult'](TestCategory.B, {
        emergencyStop: { outcome: null },
      })
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return PASS if getDangerousFaultSumCount and '
      + 'getSeriousFaultSumCount return 0 and driving faults is less than 6', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getDrivingFaultSumCount')
        .and
        .returnValue(0);

      testResultProvider['calculateCatEUAM1AndSubCategoryTestResult'](TestCategory.B, {
        emergencyStop: { outcome: null },
      })
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.PASS);
          },
        );
    });
  });
  describe('calculateCatEUAM2AndSubCategoryTestResult', () => {
    it('should return FAIL if getDangerousFaultSumCount returns more than 0', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(1);

      testResultProvider['calculateCatEUAM2AndSubCategoryTestResult'](TestCategory.B, {})
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if getSeriousFaultSumCount returns more than 0', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(1);

      testResultProvider['calculateCatEUAM2AndSubCategoryTestResult'](TestCategory.B, {})
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if getDrivingFaultSumCount returns more than 10', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getDrivingFaultSumCount')
        .and
        .returnValue(11);

      testResultProvider['calculateCatEUAM2AndSubCategoryTestResult'](TestCategory.B, {})
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return PASS if getDangerousFaultSumCount and '
      + 'getSeriousFaultSumCount return 0 and driving faults is less than 10', () => {
      spyOn(faultCountProvider, 'getDangerousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getSeriousFaultSumCount')
        .and
        .returnValue(0);
      spyOn(faultCountProvider, 'getDrivingFaultSumCount')
        .and
        .returnValue(0);

      testResultProvider['calculateCatEUAM2AndSubCategoryTestResult'](TestCategory.B, {})
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.PASS);
          },
        );
    });
  });

  describe('calculateTestResultADI3', () => {
    it('should return FAIL if riskManagement is less than 8', () => {
      testResultProvider['calculateTestResultADI3'](
        {
          lessonPlanning: { score: 0 },
          teachingLearningStrategies: { score: 0 },
          riskManagement: { score: 0 },
        } as TestDataADI3,
      )
        .subscribe(
          (val) => {
            expect(val.activityCode)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if totalScore is less than 31', () => {
      testResultProvider['calculateTestResultADI3'](
        {
          lessonPlanning: { score: 10 },
          teachingLearningStrategies: { score: 10 },
          riskManagement: { score: 10 },
        } as TestDataADI3,
      )
        .subscribe(
          (val) => {
            expect(val.activityCode)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return PASS with grade B if totalScore is '
      + 'more than or equal to 31 and less than or equal to 42', () => {
      testResultProvider['calculateTestResultADI3'](
        {
          lessonPlanning: { score: 20 },
          teachingLearningStrategies: { score: 10 },
          riskManagement: { score: 10 },
        } as TestDataADI3,
      )
        .subscribe(
          (val) => {
            expect(val)
              .toEqual({
                activityCode: ActivityCodes.PASS,
                grade: 'B',
              });
          },
        );
    });
    it('should return PASS with grade A if totalScore is more than 42', () => {
      testResultProvider['calculateTestResultADI3'](
        {
          lessonPlanning: { score: 30 },
          teachingLearningStrategies: { score: 10 },
          riskManagement: { score: 10 },
        } as TestDataADI3,
      )
        .subscribe(
          (val) => {
            expect(val)
              .toEqual({
                activityCode: ActivityCodes.PASS,
                grade: 'A',
              });
          },
        );
    });
  });

  describe('calculateCatCPCTestResult', () => {
    it('should return FAIL if scores.some returns less than 0', () => {

      testResultProvider['calculateCatCPCTestResult'](
        {
          question1: {
            score: 1,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question2: {
            score: 1,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question3: {
            score: 1,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question4: {
            score: 1,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question5: {
            score: 1,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
        } as TestDataCPC,
      )
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return FAIL if at least no scores 20 and the total score is more than 15', () => {
      testResultProvider['calculateCatCPCTestResult'](
        {
          question1: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question2: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question3: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question4: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question5: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
        } as TestDataCPC,
      )
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.FAIL);
          },
        );
    });
    it('should return PASS if at least 1 score is 20 '
      + 'and the total score is more than 15', () => {

      testResultProvider['calculateCatCPCTestResult'](
        {
          question1: {
            score: 20,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question2: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question3: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question4: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
          question5: {
            score: 19,
            answer1: {
              label: 'test',
              selected: true,
            },
          },
        } as TestDataCPC,
      )
        .subscribe(
          (val) => {
            expect(val)
              .toEqual(ActivityCodes.PASS);
          },
        );
    });
  });

  describe('ADI2', () => {
    adiCategories.forEach((cat) => {
      it(`should return a Fail when there are 7 driving faults for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.adi2SevenDrivingFaultsMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 7 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.adi2SevenDrivingFaultsWithDangerousMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 7 driving faults and a serious fault for a Cat ${cat} test`,
        (done) => {
          testResultProvider.calculateTestResult(cat, mocks.adi2SevenDrivingFaultsWithSeriousMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
      it(`should return a Fail when there are 6 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.adi2SixDrivingFaultsWithDangerousMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 6 driving faults and a serious fault for a Cat ${cat} test`,
        (done) => {
          testResultProvider.calculateTestResult(cat, mocks.adi2SixDrivingFaultsWithSeriousMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
      it(`should return a Pass when there are 6 driving faults for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.adi2SixDrivingFaultsMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.PASS);
            done();
          });
      });
      it(`should return a Fail when theres is a dangerous vehicle check for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.adi2DangerousVehicleCheckFaultsMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
    });
  });

  describe(`${fifteenCategories.join(', ')}`, () => {
    fifteenCategories.forEach((cat) => {
      it(`should return a Fail when there are 16 driving faults for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.sixteenDrivingFaultsMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 16 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.sixteenDrivingFaultsWithDangerousMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 16 driving faults and a serious fault for a Cat ${cat} test`,
        (done) => {
          testResultProvider.calculateTestResult(cat, mocks.sixteenDrivingFaultsWithSeriousMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
      it(`should return a Fail when there are 15 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.fifteenDrivingFaultsWithDangerousMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 15 driving faults and a serious fault for a Cat ${cat} test`,
        (done) => {
          testResultProvider.calculateTestResult(cat, mocks.fifteenDrivingFaultsWithSeriousMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
      it(`should return a Pass when there are 15 driving faults for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.fifteenDrivingFaultsMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.PASS);
            done();
          });
      });
    });
  });

  describe(`${twelveCategories.join(', ')}`, () => {
    twelveCategories.forEach((cat) => {
      it(`should return a Fail when there are 13 driving faults for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.thirteenDrivingFaultsMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 13 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.thirteenDrivingFaultsWithDangerousMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 13 driving faults and a serious fault for a Cat ${cat} test`,
        (done) => {
          testResultProvider.calculateTestResult(cat, mocks.thirteenDrivingFaultsWithSeriousMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
      it(`should return a Fail when there are 12 driving faults and a dangerous for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.twelveDrivingFaultsWithDangerousMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.FAIL);
            done();
          });
      });
      it(`should return a Fail when there are 12 driving faults and a serious fault for a Cat ${cat} test`,
        (done) => {
          testResultProvider.calculateTestResult(cat, mocks.twelveDrivingFaultsWithSeriousMock)
            .subscribe((result) => {
              expect(result)
                .toBe(ActivityCodes.FAIL);
              done();
            });
        });
      it(`should return a Pass when there are 12 driving faults for a Cat ${cat} test`, (done) => {
        testResultProvider.calculateTestResult(cat, mocks.twelveDrivingFaultsMock)
          .subscribe((result) => {
            expect(result)
              .toBe(ActivityCodes.PASS);
            done();
          });
      });
    });
  });
});
