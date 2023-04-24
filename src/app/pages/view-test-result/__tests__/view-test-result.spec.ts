import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { AppModule } from '@app/app.module';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { ViewTestResultPage } from '@pages/view-test-result/view-test-result.page';
import { PlatformMock } from '@mocks/ionic-mocks/platform-mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { Router } from '@angular/router';
import { SearchProvider } from '@providers/search/search';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { CompressionProvider } from '@providers/compression/compression';
import { CompressionProviderMock } from '@providers/compression/__mocks__/compression.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LoadingProvider } from '@providers/loader/loader';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultSummaryProviderMock } from '@providers/fault-summary/__mocks__/fault-summary.mock';
import { ChangeDetectorRef } from '@angular/core';
import { ErrorMessageComponent } from '@components/common/error-message/error-message';
import { ViewTestHeaderComponent } from '@pages/view-test-result/components/view-test-header/view-test-header';
import { ActivityCodeCard } from '@pages/view-test-result/components/activity-code-card/activity-code-card';
import { TestDetailsCardComponent } from '@pages/view-test-result/components/test-details-card/test-details-card';
import {
  ContactDetailsCardComponent,
} from '@pages/view-test-result/components/contact-details-card/contact-details-card';
import {
  BusinessDetailsCardComponent,
} from '@pages/view-test-result/components/business-details-card/business-details-card';
import { RekeyReasonCardComponent } from '@pages/view-test-result/components/rekey-reason-card/rekey-reason';
import { RekeyDetailsCardComponent } from '@pages/view-test-result/components/rekey-details-card/rekey-details';
import {
  ExaminerDetailsCardComponent,
} from '@pages/view-test-result/components/examiner-details-card/examiner-details';
import {
  VehicleDetailsCardComponent,
} from '@pages/view-test-result/components/vehicle-details-card/vehicle-details-card';
import {
  TrainerDetailsCardComponent,
} from '@pages/view-test-result/components/trainer-details-card/trainer-details-card';
import { DebriefCardComponent } from '@pages/view-test-result/components/debrief-card/debrief-card';
import { CPCDebriefCardComponent } from '@components/common/cpc-debrief-card/cpc-debrief-card';
import { Adi3DebriefCard } from '@components/common/adi3-debrief-card/adi3-debrief-card';
import { TestSummaryCardComponent } from '@pages/view-test-result/components/test-summary-card/test-summary-card';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ViewTestResultViewDidEnter } from '@pages/view-test-result/view-test-result.actions';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { JournalData, TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { Subscription } from 'rxjs';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import {
  TestResultCatADI3Schema,
  TrainerDetails as CatADI3TrainerDetails,
} from '@dvsa/mes-test-schema/categories/ADI3';
import {
  ExaminerDetailsModel,
} from '@pages/view-test-result/components/examiner-details-card/examiner-details-card.model';
import { getCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestOutcomeText } from '@store/tests/tests.selector';
import { TestOutcome } from '@store/tests/tests.constants';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';

describe('ViewTestResultPage', () => {
  let fixture: ComponentFixture<ViewTestResultPage>;
  let component: ViewTestResultPage;
  let store$: Store<StoreModel>;
  let faultSummaryProvider: FaultSummaryProvider;
  let loadingProvider: LoadingProvider;
  let compressionProvider: CompressionProvider;

  const mockTestResult = {
    activityCode: '28',
    category: TestCategory.B,
    testData: {
      dangerousFaults: {
        controlsAccelerator: true,
        controlsClutch: true,
      },
      drivingFaults: {
        controlsAccelerator: 1,
        controlsClutch: 14,
        controlsGears: 5,
      },
      seriousFaults: {
        controlsGears: true,
      },
    },
  } as unknown as TestResultCommonSchema;
  const getCandidateNameMock = () => {
    return 'Candidate Name';
  };
  const getTestOutcomeTextMock = () => {
    return TestOutcome.Passed;
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewTestResultPage,
        MockComponent(ErrorMessageComponent),
        MockComponent(ViewTestHeaderComponent),
        MockComponent(ActivityCodeCard),
        MockComponent(TestDetailsCardComponent),
        MockComponent(ContactDetailsCardComponent),
        MockComponent(BusinessDetailsCardComponent),
        MockComponent(RekeyDetailsCardComponent),
        MockComponent(RekeyReasonCardComponent),
        MockComponent(ExaminerDetailsCardComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(TrainerDetailsCardComponent),
        MockComponent(DebriefCardComponent),
        MockComponent(CPCDebriefCardComponent),
        MockComponent(Adi3DebriefCard),
        MockComponent(TestSummaryCardComponent),
      ],
      imports: [
        AppModule,
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: getCandidateName, useClass: getCandidateNameMock },
        { provide: getTestOutcomeText, useClass: getTestOutcomeTextMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Router, useClass: RouterMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: SearchProvider, useClass: SearchProviderMock },
        { provide: CompressionProvider, useClass: CompressionProviderMock },
        { provide: LogHelper, useClass: LogHelperMock },
        { provide: LoadingProvider, useClass: LoadingProvider }, // stub
        { provide: FaultCountProvider, useClass: FaultCountProvider }, // stub
        { provide: FaultSummaryProvider, useClass: FaultSummaryProviderMock },
        { provide: ChangeDetectorRef, useClass: ChangeDetectorRef }, // stub
        { provide: ADI3AssessmentProvider, useClass: ADI3AssessmentProvider },
      ],
    });

    faultSummaryProvider = TestBed.inject(FaultSummaryProvider);
    fixture = TestBed.createComponent(ViewTestResultPage);
    component = fixture.componentInstance;
    component.modalCtrl = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    loadingProvider = TestBed.inject(LoadingProvider);
    compressionProvider = TestBed.inject(CompressionProvider);
    component.testResult = mockTestResult;
  }));

  it('should ', () => {
    expect(component).toBeTruthy();
  });
  describe('getDrivingFaultSumCount', () => {
    it('should call faultCountProvider with the correct parameters', () => {
      component.testCategory = TestCategory.B;
      spyOn(component.faultCountProvider, 'getDrivingFaultSumCount');
      component.getDrivingFaultSumCount();
      expect(component.faultCountProvider.getDrivingFaultSumCount).toHaveBeenCalledWith(TestCategory.B, {
        dangerousFaults: {
          controlsAccelerator: true,
          controlsClutch: true,
        },
        drivingFaults: {
          controlsAccelerator: 1,
          controlsClutch: 14,
          controlsGears: 5,
        },
        seriousFaults: {
          controlsGears: true,
        },
      });
    });
  });

  describe('getDangerousFaults', () => {
    it('should call faultSummaryProvider with the correct parameters', () => {
      spyOn(faultSummaryProvider, 'getDangerousFaultsList');
      component.testCategory = TestCategory.B;

      component.getDangerousFaults();
      expect(faultSummaryProvider.getDangerousFaultsList).toHaveBeenCalledWith({
        dangerousFaults: {
          controlsAccelerator: true,
          controlsClutch: true,
        },
        drivingFaults: {
          controlsAccelerator: 1,
          controlsClutch: 14,
          controlsGears: 5,
        },
        seriousFaults: {
          controlsGears: true,
        },
      }, TestCategory.B);
    });
  });
  describe('getSeriousFaults', () => {
    it('should call faultSummaryProvider with the correct parameters', () => {
      spyOn(faultSummaryProvider, 'getSeriousFaultsList');
      component.testCategory = TestCategory.B;

      component.getSeriousFaults();
      expect(faultSummaryProvider.getSeriousFaultsList).toHaveBeenCalledWith({
        dangerousFaults: {
          controlsAccelerator: true,
          controlsClutch: true,
        },
        drivingFaults: {
          controlsAccelerator: 1,
          controlsClutch: 14,
          controlsGears: 5,
        },
        seriousFaults: {
          controlsGears: true,
        },
      }, TestCategory.B);
    });
  });

  describe('getDrivingFaults', () => {
    it('should call faultSummaryProvider with the correct parameters', () => {
      spyOn(faultSummaryProvider, 'getDrivingFaultsList');
      component.testCategory = TestCategory.B;

      component.getDrivingFaults();
      expect(faultSummaryProvider.getDrivingFaultsList).toHaveBeenCalledWith({
        dangerousFaults: {
          controlsAccelerator: true,
          controlsClutch: true,
        },
        drivingFaults: {
          controlsAccelerator: 1,
          controlsClutch: 14,
          controlsGears: 5,
        },
        seriousFaults: {
          controlsGears: true,
        },
      }, TestCategory.B);
    });
  });

  describe('getReason', () => {
    it('should return reasonForNoAdviceGiven', () => {
      component.testResult.testData = { review: { reasonForNoAdviceGiven: 'testData' } };
      expect(component.getReason()).toEqual('testData');
    });
  });

  describe('getInstructorData', () => {
    it('should return registrationNumber if test result is present', () => {
      component.testResult = { instructorDetails: { registrationNumber: 1 } } as TestResultSchemasUnion;
      const { registrationNumber } = component.getInstructorData();
      expect(registrationNumber).toEqual(Object(1));
    });
    it('should return null if test result is not present', () => {
      component.testResult = null;
      expect(component.getInstructorData()).toEqual(null);
    });
  });
  describe('getReviewData', () => {
    it('should return review if test result is present', () => {
      component.testResult.testData = { review: { feedback: 'testData', seekFurtherDevelopment: true } };
      const { feedback, seekFurtherDevelopment } = component.getReviewData();
      expect(feedback).toEqual(Object('testData'));
      expect(seekFurtherDevelopment).toEqual(Object(true));
    });
    it('should return null if test result is not present', () => {
      component.testResult = null;
      expect(component.getReviewData()).toEqual(null);
    });
  });
  describe('getTrainerData', () => {
    it('should return trainerDetails if test result is present', () => {
      component.testResult = {
        trainerDetails: {
          pdiLogbook: true,
          traineeLicence: true,
          orditTrainedCandidate: true,
          trainingRecords: true,
          trainerRegistrationNumber: 1,
        } as CatADI3TrainerDetails,
      } as TestResultCatADI3Schema;

      const {
        pdiLogbook,
        traineeLicence,
        orditTrainedCandidate,
        trainingRecords,
        trainerRegistrationNumber,
      } = component.getTrainerData() as CatADI3TrainerDetails & CatADI2UniqueTypes.TrainerDetails;

      expect(pdiLogbook).toEqual(Object(true));
      expect(traineeLicence).toEqual(Object(true));
      expect(orditTrainedCandidate).toEqual(Object(true));
      expect(trainingRecords).toEqual(Object(true));
      expect(trainerRegistrationNumber).toEqual(Object(1));
    });
    it('should return null if test result is not present', () => {
      component.testResult = null;
      expect(component.getTrainerData()).toEqual(null);
    });
  });

  describe('getExaminerDetails', () => {
    it('should return journalData if test result is present', () => {

      component.testResult = {
        journalData: {
          examiner: {
            staffNumber: 'testData',
          },
          testCentre: {
            costCode: 'testData1',
            centreName: 'testData2',
          },
        } as JournalData,
      } as TestResultCommonSchema;

      const {
        staffNumber,
        costCode,
        testCentreName,
      } = component.getExaminerDetails() as ExaminerDetailsModel;

      expect(staffNumber).toEqual(Object('testData'));
      expect(costCode).toEqual(Object('testData1'));
      expect(testCentreName).toEqual(Object('testData2'));
    });
    it('should return null if test result is not present', () => {
      component.testResult = null;
      expect(component.getExaminerDetails()).toEqual(null);
    });
  });

  describe('showDebriefCommonCard', () => {
    it('should return true if the TestCategory is on the approved list', () => {
      const category = [
        TestCategory.B, TestCategory.BE, TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1,
        TestCategory.EUAM1, TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2,
        TestCategory.C, TestCategory.C1, TestCategory.C1E, TestCategory.CE, TestCategory.CM, TestCategory.C1M,
        TestCategory.C1EM, TestCategory.CEM, TestCategory.D, TestCategory.D1, TestCategory.D1E, TestCategory.DE,
        TestCategory.DM, TestCategory.D1M, TestCategory.D1EM, TestCategory.DEM,
        TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K,
        TestCategory.ADI2,
      ];

      category.forEach((cat) => {
        component.testCategory = cat;
        expect(component.showDebriefCommonCard()).toEqual(true);
      });
    });
    it('should return false if the TestCategory is not on the approved list', () => {
      component.testCategory = TestCategory.CCPC;
      expect(component.showDebriefCommonCard()).toEqual(false);
    });
  });

  describe('showVehicleDetailsCommonCard', () => {
    it('should return true if the TestCategory is on the approved list', () => {
      const category = [
        TestCategory.B, TestCategory.BE, TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1,
        TestCategory.EUAM1, TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2,
        TestCategory.C, TestCategory.C1, TestCategory.C1E, TestCategory.CE, TestCategory.CM, TestCategory.C1M,
        TestCategory.C1EM, TestCategory.CEM, TestCategory.D, TestCategory.D1, TestCategory.D1E, TestCategory.DE,
        TestCategory.DM, TestCategory.D1M, TestCategory.D1EM, TestCategory.DEM, TestCategory.F, TestCategory.G,
        TestCategory.H, TestCategory.K, TestCategory.ADI2, TestCategory.ADI3, TestCategory.CCPC, TestCategory.DCPC,
      ];

      category.forEach((cat) => {
        component.testCategory = cat;
        expect(component.showVehicleDetailsCommonCard()).toEqual(true);
      });
    });
    it('should return false if the TestCategory is not on the approved list', () => {
      component.testCategory = TestCategory.A;
      expect(component.showVehicleDetailsCommonCard()).toEqual(false);
    });
  });

  describe('onClose', () => {
    it('should dismiss modalCtrl', async () => {
      spyOn(component.modalCtrl, 'dismiss');
      await component.onClose();
      expect(component.modalCtrl.dismiss).toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch the ViewTestResultViewDidEnter action', () => {
      spyOn(store$, 'dispatch');
      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(ViewTestResultViewDidEnter(component.applicationReference));
    });
  });

  describe('isCategoryB', () => {
    it('should return true if the testCategory is B', () => {
      component.testCategory = TestCategory.B;
      expect(component.isCategoryB()).toEqual(true);
    });
    it('should return false if the testCategory is not B', () => {
      component.testCategory = TestCategory.C;
      expect(component.isCategoryB()).toEqual(false);
    });
  });
  describe('isCategoryADI3', () => {
    it('should return true if the testCategory is ADI3', () => {
      component.testCategory = TestCategory.ADI3;
      expect(component.isCategoryADI3()).toEqual(true);
    });
    it('should return false if the testCategory is not ADI3', () => {
      component.testCategory = TestCategory.C;
      expect(component.isCategoryADI3()).toEqual(false);
    });
  });
  describe('showCPCDebriefCommonCard', () => {
    it('should return true if the testCategory is CCPC or DCPC', () => {
      component.testCategory = TestCategory.CCPC;
      expect(component.showCPCDebriefCommonCard()).toEqual(true);
      component.testCategory = TestCategory.DCPC;
      expect(component.showCPCDebriefCommonCard()).toEqual(true);
    });
    it('should return false if the testCategory is not CCPC or DCPC', () => {
      component.testCategory = TestCategory.C;
      expect(component.showCPCDebriefCommonCard()).toEqual(false);
    });
  });

  describe('didTestTerminate', () => {
    it('should return true if the activityCode is not set to a fail value or the pass value', () => {
      component.testResult.activityCode = '41';
      expect(component.didTestTerminate()).toEqual(true);
    });
    it('should return true if the activityCode is set to a fail value', () => {
      component.testResult.activityCode = '2';
      expect(component.didTestTerminate()).toEqual(false);
    });
    it('should return false if the activityCode is set to the pass value', () => {
      component.testResult.activityCode = '1';
      expect(component.didTestTerminate()).toEqual(false);
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe)
        .toHaveBeenCalled();
    });
    it('should unsubscribe from reEnterEmailSubscription if there is one', () => {
      component.reEnterEmailSubscription = new Subscription();
      spyOn(component.reEnterEmailSubscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.reEnterEmailSubscription.unsubscribe)
        .toHaveBeenCalled();
    });
  });

  describe('getVehicleDetails', () => {
    it('should return null if there is no test result and the category is B', () => {
      component.testResult = null;
      spyOn(component, 'isCategoryB').and.returnValue(true);
      expect(component.getVehicleDetails()).toEqual(null);
    });
    it('should return null if there a no test result and the category is not B', () => {
      component.testResult = { activityCode: '1' } as TestResultSchemasUnion;
      spyOn(component, 'isCategoryB').and.returnValue(false);
      expect(component.getVehicleDetails()).toEqual(null);
    });
    it('should return Dual controls if dualControls is true and the category is B', () => {
      component.testResult = { vehicleDetails: { dualControls: true } } as TestResultSchemasUnion;
      spyOn(component, 'isCategoryB').and.returnValue(true);
      expect(component.getVehicleDetails()).toEqual(['Dual controls']);
    });
    it('should return School car if schoolCar is true and the category is B', () => {
      component.testResult = { vehicleDetails: { schoolCar: true } } as TestResultSchemasUnion;
      spyOn(component, 'isCategoryB').and.returnValue(true);
      expect(component.getVehicleDetails()).toEqual(['School car']);
    });
  });

  describe('getCandidateDetails', () => {
    it('should return null if there is no test result', () => {
      component.testResult = null;
      expect(component.getCandidateDetails()).toEqual(null);
    });
    it('should return an object with PRN and amount of attempts if the data is in testResult', () => {
      component.testResult = { journalData: { candidate: { prn: 1, previousADITests: 2 } } } as TestResultSchemasUnion;
      expect(component.getCandidateDetails()).toEqual({ prn: 1, attemptNumber: 2 });
    });
  });

  describe('getHeaderDetails', () => {
    it('should return null if there is no test result', () => {
      component.testResult = null;
      expect(component.getHeaderDetails()).toEqual(null);
    });
    it('should return an object with correct data if the data is in testResult', () => {
      component.testResult = {
        journalData: {
          candidate: {
            candidateName: { title: 'Mr', firstName: 'Firstname', lastName: 'Lastname' },
            driverNumber: '1',
          },
        },
        activityCode: '1',
        testData: { review: { grade: 'A' } },
      } as TestResultSchemasUnion;

      expect(component.getHeaderDetails()).toEqual({
        candidateName: 'Mr Firstname Lastname',
        candidateDriverNumber: '1',
        activityCode: '1',
        testOutcome: TestOutcome.Passed,
        grade: 'A',
      });
    });
  });

  describe('getTestDetails', () => {
    it('should return null if there is no test result', () => {
      component.testResult = null;
      expect(component.getTestDetails()).toEqual(null);
    });
    it('should return an object with correct data if the data is in testResult', () => {
      component.testResult = {
        category: 'B',
        journalData: {
          testSlotAttributes: {
            start: '2020-12-25T08:10:00',
            specialNeedsArray: ['test'],
            entitlementCheck: true,
            slotType: 'testSlot',
            previousCancellation: ['Act of nature'],
          },
          applicationReference: {
            applicationId: 1,
            bookingSequence: 2,
            checkDigit: 3,
          },
        },
        activityCode: '1',
        testData: {
          vehicleChecks: { fullLicenceHeld: true },
        },
      } as TestResultSchemasUnion;

      expect(component.getTestDetails()).toEqual({
        date: 'Friday 25th December 2020',
        time: '08:10',
        applicationReference: '1023',
        category: TestCategory.B,
        specialNeeds: ['test'],
        entitlementCheck: true,
        slotType: 'testSlot',
        previousCancellations: ['Act of nature'],
        fullLicenceHeld: true,
      });
    });
  });

  describe('handleLoadingUI', () => {
    it('should set isLoading to the value passed in', () => {

      component.isLoading = null;
      component.handleLoadingUI(false);
      spyOn(loadingProvider, 'handleUILoading').and.callThrough();
      expect(component.isLoading).toEqual(false);
    });
  });

  describe('ngOnInit', () => {
    it('should set subscription to the correct values', async () => {
      component.testResult = null;
      spyOn(component, 'handleLoadingUI').and.callThrough();
      spyOn(compressionProvider, 'extractTestResult').and.returnValue({
        testData: { startTime: '1' },
      } as TestResultSchemasUnion);

      await component.ngOnInit();

      expect(component.testResult).toEqual({
        testData: { startTime: '1' },
      } as TestResultSchemasUnion);
    });
    it('should set reEnterEmailSubscription to the correct values', async () => {
      component.reEnterEmail = null;
      spyOn(component, 'handleLoadingUI').and.callThrough();
      spyOn(compressionProvider, 'extractUnformatted').and.returnValue({
        test: '1',
      });

      await component.ngOnInit();

      expect(component.reEnterEmail).toEqual({
        test: '1',
      });
    });
    it('should call dispatch with a saveLog if it is unable to get a testResult', async () => {
      component.testResult = null;
      spyOn(component, 'handleLoadingUI').and.callThrough();
      spyOn(component['store$'], 'dispatch');
      spyOn(compressionProvider, 'extractTestResult').and.throwError('test');

      await component.ngOnInit();

      expect(component['store$'].dispatch).toHaveBeenCalledWith(SaveLog({
        payload: component['logHelper'].createLog(
          LogType.ERROR,
          `Getting test result for app ref (${component.applicationReference})`,
          'test',
        ),
      }));
    });
  });

  describe('totalScore', () => {
    it('should return null if category is not ADI3', () => {
      spyOn(component, 'isCategoryADI3').and.returnValue(false);
      expect(component.totalScore).toEqual(null);
    });
    it('should call getTotalAssessmentScore if category is ADI3', () => {
      spyOn(component, 'isCategoryADI3').and.returnValue(true);
      spyOn(component.adi3AssessmentProvider, 'getTotalAssessmentScore').and.returnValue(10);
      component.testResult.testData = { startTime: '1' };
      expect(component.totalScore).toEqual(10);
      expect(component.adi3AssessmentProvider.getTotalAssessmentScore).toHaveBeenCalledWith({ startTime: '1' });
    });
  });
});
