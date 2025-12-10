import { ChangeDetectorRef, Component, Injector, Input, OnInit } from '@angular/core';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import {
  Review as CatADI3Review,
  TestData as CatADI3TestData,
  TrainerDetails as CatADI3TrainerDetails,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { getTestOutcome } from '@pages/debrief/debrief.selector';
import { ExaminerDetailsModel } from '@pages/view-test-result/components/examiner-details-card/examiner-details-card.model';
import { ViewTestHeaderModel } from '@pages/view-test-result/components/view-test-header/view-test-header.model';
import { ViewTestResultViewDidEnter } from '@pages/view-test-result/view-test-result.actions';
import { RegeneratedEmails } from '@pages/view-test-result/view-test-result.model';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { CompressionProvider } from '@providers/compression/compression';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { LoadingProvider } from '@providers/loader/loader';
import { SearchProvider } from '@providers/search/search';
import { BasePageComponent } from '@shared/classes/base-page';
import { DateTime } from '@shared/helpers/date-time';
import { getFormattedApplicationReference } from '@shared/helpers/getApplicationIdDetails';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { ErrorTypes } from '@shared/models/error-message';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { LogType } from '@shared/models/log.model';
import { SaveLog } from '@store/logs/logs.actions';
import { getCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestOutcomeText } from '@store/tests/tests.selector';
import { getPreviousFilteredVRNs } from '@store/tests/vehicle-details/vehicle-details.selector';
import { get } from 'lodash-es';
import { Subscription, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TestDetailsModel } from './components/test-details-card/test-details-card.model';

@Component({
  selector: '.view-test-result',
  templateUrl: 'view-test-result.page.html',
  styleUrls: ['view-test-result.page.scss'],
  standalone: false,
})
export class ViewTestResultPage extends BasePageComponent implements OnInit {
  @Input()
  applicationReference: string;

  @Input()
  testCategory: TestCategory;

  isLoading: boolean;
  testResult: TestResultSchemasUnion;
  subscription: Subscription;
  showErrorMessage = false;
  errorLink: string;
  additionalErrorText: boolean;
  reEnterEmailSubscription: Subscription;
  reEnterEmail: RegeneratedEmails = null;

  constructor(
    public modalCtrl: ModalController,
    private searchProvider: SearchProvider,
    private compressionProvider: CompressionProvider,
    private loadingProvider: LoadingProvider,
    public faultCountProvider: FaultCountProvider,
    private faultSummaryProvider: FaultSummaryProvider,
    private ref: ChangeDetectorRef,
    public adi3AssessmentProvider: ADI3AssessmentProvider,
    injector: Injector
  ) {
    super(injector);
  }

  async ngOnInit(): Promise<void> {
    await this.handleLoadingUI(true);

    this.reEnterEmailSubscription = this.searchProvider
      .getRegeneratedEmails(this.applicationReference)
      .pipe(
        map((response) => this.compressionProvider.extract<RegeneratedEmails>(response)),
        tap((data) => (this.reEnterEmail = data)),
        catchError(() => of(null))
      )
      .subscribe();

    // this.subscription = this.searchProvider
    //   .getTestResult(this.applicationReference, this.authenticationProvider.getEmployeeId())
    this.subscription = of({
      rekey: false,
      version: '3.44.0',
      category: 'B',
      testData: {
        ETA: {},
        eco: {
          completed: true,
        },
        manoeuvres: {
          reverseRight: {
            selected: true,
          },
        },
        eyesightTest: {
          complete: true,
          seriousFault: false,
        },
        drivingFaults: {
          followingDistance: 1,
          controlsAccelerator: 1,
          pedestrianCrossings: 1,
          junctionsCuttingCorners: 1,
          useOfMirrorsChangeDirection: 1,
        },
        seriousFaults: {},
        vehicleChecks: {
          showMeQuestion: {
            code: 'S4',
            outcome: 'P',
            description: 'Rear demister',
          },
          tellMeQuestion: {
            code: 'T1',
            outcome: 'DF',
            description: 'Brakes',
          },
        },
        controlledStop: {
          selected: true,
        },
        dangerousFaults: {},
        testRequirements: {
          hillStart: true,
          angledStart: true,
          normalStart1: true,
        },
      },
      appVersion: '4.25.0.0',
      journalData: {
        examiner: {
          staffNumber: '1234567',
          individualId: 9000001,
        },
        candidate: {
          gender: 'F',
          candidateId: 126,
          dateOfBirth: '1974-09-14',
          driverNumber: 'COOPE015220A99HC',
          candidateName: {
            title: 'Mr',
            lastName: 'Alice',
            firstName: 'Cooper',
          },
          ethnicityCode: 'E',
          mobileTelephone: '07654 123456',
          candidateAddress: {
            postcode: 'AB12 3CD',
            addressLine1: '2345 Station Street',
            addressLine2: 'Someplace',
            addressLine3: 'Sometown',
          },
          primaryTelephone: '01234 567890',
          secondaryTelephone: '04321 098765',
        },
        testCentre: {
          centreId: 3034,
          costCode: 'B1234',
          centreName: 'Test DA2',
        },
        testSlotAttributes: {
          start: '2025-12-10T07:00:00',
          slotId: 5137,
          slotType: 'Extra Time Needed',
          fitMarker: false,
          welshTest: false,
          extendedTest: false,
          specialNeeds: false,
          vehicleTypeCode: 'C',
          entitlementCheck: false,
          examinerVisiting: false,
          specialNeedsCode: 'EXTRA',
          specialNeedsArray: ['None'],
          previousCancellation: ['Act of nature'],
          categoryEntitlementCheck: false,
          specialNeedsExtendedTest: false,
        },
        applicationReference: {
          bookingId: 'This is an app ref',
        },
      },
      rekeyReason: {
        other: {
          reason: '',
          selected: false,
        },
        transfer: {
          selected: false,
        },
        ipadIssue: {
          lost: false,
          broken: false,
          stolen: false,
          selected: false,
          technicalFault: false,
        },
      },
      testSummary: {
        D255: false,
        routeNumber: 3,
        identification: 'Licence',
        debriefWitnessed: true,
        weatherConditions: ['Dull / dry roads'],
        trueLikenessToPhoto: true,
      },
      activityCode: '1',
      changeMarker: false,
      accompaniment: {
        ADI: true,
      },
      delegatedTest: false,
      examinerKeyed: 1234567,
      userExitedApp: {
        exitFlag: false,
      },
      examinerBooked: 1234567,
      passCompletion: {
        passCertificateNumber: 'C123456X',
        provisionalLicenceProvided: true,
      },
      vehicleDetails: {
        motStatus: 'No details',
        dualControls: true,
        gearboxCategory: 'Manual',
        registrationNumber: 'CA17DSA',
        previouslySearchedRegNumbers: ['CA17DSA'],
      },
      examinerConducted: 1234567,
      instructorDetails: {},
      preTestDeclarations: {
        preTestSignature: '',
        healthDeclarationAccepted: true,
        passCertificateNumberReceived: true,
        insuranceDeclarationAccepted: true,
        residencyDeclarationAccepted: true,
      },
      communicationPreferences: {
        updatedEmail: '',
        conductedLanguage: 'English',
        communicationMethod: 'Post',
      },
    } as TestResultSchemasUnion)
      .pipe(
        // map((response: HttpResponse<string>): string => response.body),
        // map((data) => (this.testResult = this.compressionProvider.extract<TestResultSchemasUnion>(data))),
        map((data) => (this.testResult = data)),
        tap((data) => {
          //If there are previously searched reg numbers, filter out the current reg number and any duplicates
          if (data?.vehicleDetails?.previouslySearchedRegNumbers) {
            data.vehicleDetails.previouslySearchedRegNumbers = getPreviousFilteredVRNs(
              data.vehicleDetails.previouslySearchedRegNumbers,
              data.vehicleDetails.registrationNumber
            );
          }
          return data;
        }),
        tap(async () => this.handleLoadingUI(false)),
        catchError(async (err) => {
          this.store$.dispatch(
            SaveLog({
              payload: this.logHelper.createLog(
                LogType.ERROR,
                `Getting test result for app ref (${this.applicationReference})`,
                err
              ),
            })
          );
          this.errorLink = ErrorTypes.SEARCH_RESULT;
          this.additionalErrorText = true;
          this.showErrorMessage = true;
          await this.handleLoadingUI(false);
          return of();
        })
      )
      .subscribe();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(ViewTestResultViewDidEnter(this.applicationReference));
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.reEnterEmailSubscription) {
      this.reEnterEmailSubscription.unsubscribe();
    }
  }

  public isADI3 = (): boolean => this.testResult.category === TestCategory.ADI3;

  getReason() {
    return get(this.testResult, 'testData.review.reasonForNoAdviceGiven');
  }

  get totalScore(): number {
    if (this.isCategoryADI3() || this.isCategorySC()) {
      return this.adi3AssessmentProvider.getTotalAssessmentScore(this.testResult.testData as CatADI3TestData);
    }
    return null;
  }

  handleLoadingUI = async (isLoading: boolean): Promise<void> => {
    this.isLoading = isLoading;

    await this.loadingProvider.handleUILoading(isLoading, { spinner: 'circles' });

    if (!isLoading) {
      this.ref.detach();
    }
  };

  getTestDetails(): TestDetailsModel {
    if (!this.testResult) {
      return null;
    }

    const startDate = DateTime.at(get(this.testResult, 'journalData.testSlotAttributes.start'));

    return {
      date: startDate.format('dddd Do MMMM YYYY'),
      time: startDate.format('HH:mm'),
      applicationReference: getFormattedApplicationReference(get(this.testResult, 'journalData.applicationReference')),
      category: get(this.testResult, 'category') as TestCategory,
      specialNeeds: get(this.testResult, 'journalData.testSlotAttributes.specialNeedsArray'),
      entitlementCheck: get(this.testResult, 'journalData.testSlotAttributes.entitlementCheck'),
      slotType: get(this.testResult, 'journalData.testSlotAttributes.slotType'),
      previousCancellations: get(this.testResult, 'journalData.testSlotAttributes.previousCancellation', []),
      fullLicenceHeld: get(this.testResult, 'testData.vehicleChecks.fullLicenceHeld'),
    };
  }

  getHeaderDetails(): ViewTestHeaderModel {
    if (!this.testResult) {
      return null;
    }

    return {
      candidateName: getCandidateName(get(this.testResult, 'journalData.candidate')),
      candidateDriverNumber: get(this.testResult, 'journalData.candidate.driverNumber'),
      activityCode: get(this.testResult, 'activityCode'),
      testOutcome: getTestOutcomeText(this.testResult),
      grade: get(this.testResult, 'testData.review.grade'),
    };
  }

  getCandidateDetails(): { prn: number; attemptNumber: number } {
    if (!this.testResult) {
      return null;
    }

    return {
      prn: get(this.testResult, 'journalData.candidate.prn'),
      attemptNumber: get(this.testResult, 'journalData.candidate.previousADITests'),
    };
  }

  getVehicleDetails(): string[] {
    if (!this.testResult || !isAnyOf(this.testCategory, [TestCategory.B, TestCategory.ADI2])) {
      return null;
    }

    const vehicleInformation: string[] = [];

    if (get(this.testResult, 'vehicleDetails.dualControls')) {
      vehicleInformation.push('Dual controls');
    }

    if (get(this.testResult, 'vehicleDetails.schoolCar')) {
      vehicleInformation.push('School car');
    }

    return vehicleInformation;
  }

  getExaminerDetails(): ExaminerDetailsModel {
    if (!this.testResult) {
      return null;
    }

    return {
      staffNumber: get(this.testResult, 'journalData.examiner.staffNumber'),
      costCode: get(this.testResult, 'journalData.testCentre.costCode'),
      testCentreName: get(this.testResult, 'journalData.testCentre.centreName'),
    };
  }

  getTrainerData(): CatADI3TrainerDetails | CatADI2UniqueTypes.TrainerDetails {
    if (!this.testResult) {
      return null;
    }

    return {
      pdiLogbook: get(this.testResult, 'trainerDetails.pdiLogbook'),
      traineeLicence: get(this.testResult, 'trainerDetails.traineeLicence'),
      orditTrainedCandidate: get(this.testResult, 'trainerDetails.orditTrainedCandidate'),
      trainingRecords: get(this.testResult, 'trainerDetails.trainingRecords'),
      trainerRegistrationNumber: get(this.testResult, 'trainerDetails.trainerRegistrationNumber'),
    };
  }

  getReviewData(): CatADI3Review {
    if (!this.testResult) {
      return null;
    }

    return {
      feedback: get(this.testResult, 'testData.review.feedback'),
      seekFurtherDevelopment: get(this.testResult, 'testData.review.seekFurtherDevelopment'),
    };
  }

  getInstructorData(): CatBUniqueTypes.InstructorDetails {
    if (!this.testResult) {
      return null;
    }

    return {
      registrationNumber: get(this.testResult, 'instructorDetails.registrationNumber'),
    };
  }

  getValidCertificate() {
    if (!this.testResult || !this.isCategorySC()) {
      return null;
    }

    return get(this.testResult, 'preTestDeclarations.validCertificate') ? 'Yes' : 'No';
  }

  isCategoryB = (): boolean => isAnyOf(this.testCategory, [TestCategory.B]);

  isCategoryADI3 = (): boolean => isAnyOf(this.testCategory, [TestCategory.ADI3]);

  isCategorySC = (): boolean => isAnyOf(this.testCategory, [TestCategory.SC]);

  showDebriefCommonCard = (): boolean =>
    isAnyOf(this.testCategory, [
      TestCategory.B, // Cat B
      TestCategory.BE, // Cat BE
      TestCategory.EUAMM1,
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAM1, // Cat A Mod 1
      TestCategory.EUAMM2,
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAM2, // Cat A Mod 2
      TestCategory.C,
      TestCategory.C1,
      TestCategory.C1E,
      TestCategory.CE, // Cat C3B
      TestCategory.CM,
      TestCategory.C1M,
      TestCategory.C1EM,
      TestCategory.CEM, // Cat C3A
      TestCategory.D,
      TestCategory.D1,
      TestCategory.D1E,
      TestCategory.DE, // Cat D3B
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.D1EM,
      TestCategory.DEM, // Cat D3A
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K, // Cat Home
      TestCategory.ADI2, // ADI
    ]);

  showCPCDebriefCommonCard = (): boolean => isAnyOf(this.testCategory, [TestCategory.CCPC, TestCategory.DCPC]);

  showVehicleDetailsCommonCard: () => boolean = () =>
    isAnyOf(this.testCategory, [
      TestCategory.B, // Cat B
      TestCategory.BE, // Cat BE
      TestCategory.EUAMM1,
      TestCategory.EUA1M1,
      TestCategory.EUA2M1,
      TestCategory.EUAM1, // Cat A Mod 1
      TestCategory.EUAMM2,
      TestCategory.EUA1M2,
      TestCategory.EUA2M2,
      TestCategory.EUAM2, // Cat A Mod 2
      TestCategory.C,
      TestCategory.C1,
      TestCategory.C1E,
      TestCategory.CE, // Cat C 3B
      TestCategory.CM,
      TestCategory.C1M,
      TestCategory.C1EM,
      TestCategory.CEM, // Cat C 3A
      TestCategory.D,
      TestCategory.D1,
      TestCategory.D1E,
      TestCategory.DE, // Cat D 3B
      TestCategory.DM,
      TestCategory.D1M,
      TestCategory.D1EM,
      TestCategory.DEM, // Cat D 3A
      TestCategory.F,
      TestCategory.G,
      TestCategory.H,
      TestCategory.K, // Cat Home
      TestCategory.ADI2,
      TestCategory.ADI3, // ADI
      TestCategory.CCPC,
      TestCategory.DCPC,
      TestCategory.SC,
    ]);

  getDrivingFaultSumCount(): number {
    return this.faultCountProvider.getDrivingFaultSumCount(this.testCategory, this.testResult.testData);
  }

  getDangerousFaults(): FaultSummary[] {
    return this.faultSummaryProvider.getDangerousFaultsList(get(this.testResult, 'testData'), this.testCategory);
  }

  getSeriousFaults(): FaultSummary[] {
    return this.faultSummaryProvider.getSeriousFaultsList(get(this.testResult, 'testData'), this.testCategory);
  }

  getDrivingFaults(): FaultSummary[] {
    return this.faultSummaryProvider.getDrivingFaultsList(get(this.testResult, 'testData'), this.testCategory);
  }

  async onClose(): Promise<void> {
    await this.modalCtrl.dismiss();
  }

  didTestTerminate(): boolean {
    return getTestOutcome(this.testResult as TestResultCommonSchema) === 'Terminated';
  }
}
