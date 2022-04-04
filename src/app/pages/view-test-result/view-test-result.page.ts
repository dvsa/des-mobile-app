import {
  ChangeDetectorRef,
  Component, Input, OnInit,
} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { BasePageComponent } from '@shared/classes/base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { get } from 'lodash';
import { formatApplicationReference } from '@shared/helpers/formatters';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { ViewTestResultViewDidEnter } from '@pages/view-test-result/view-test-result.actions';
import { of, Subscription } from 'rxjs';
import { SearchProvider } from '@providers/search/search';
import { HttpResponse } from '@angular/common/http';
import { CompressionProvider } from '@providers/compression/compression';
import { catchError, map, tap } from 'rxjs/operators';
import { LogHelper } from '@providers/logs/logs-helper';
import { SaveLog } from '@store/logs/logs.actions';
import { LogType } from '@shared/models/log.model';
import { ErrorTypes } from '@shared/models/error-message';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import {
  ExaminerDetailsModel,
} from '@pages/view-test-result/components/examiner-details-card/examiner-details-card.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { LoadingProvider } from '@providers/loader/loader';
import { ViewTestHeaderModel } from '@pages/view-test-result/components/view-test-header/view-test-header.model';
import { getCandidateName } from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getTestOutcomeText } from '@store/tests/tests.selector';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';
import { TestDetailsModel } from './components/test-details-card/test-details-card.model';

@Component({
  selector: '.view-test-result',
  templateUrl: 'view-test-result.page.html',
  styleUrls: ['view-test-result.page.scss'],
})
export class ViewTestResultPage extends BasePageComponent implements OnInit {

  @Input()
  applicationReference: string;

  @Input()
  testCategory: TestCategory;

  isLoading: boolean;
  testResult: TestResultSchemasUnion;
  subscription: Subscription;
  showErrorMessage: boolean = false;
  errorLink: string;
  additionalErrorText: boolean;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    private modalCtrl: ModalController,
    private store$: Store<StoreModel>,
    private searchProvider: SearchProvider,
    private compressionProvider: CompressionProvider,
    private logHelper: LogHelper,
    private loadingProvider: LoadingProvider,
    private faultCountProvider: FaultCountProvider,
    private faultSummaryProvider: FaultSummaryProvider,
    private ref: ChangeDetectorRef,
  ) {
    super(platform, authenticationProvider, router);
  }

  async ngOnInit(): Promise<void> {
    await this.handleLoadingUI(true);

    this.subscription = this.searchProvider
      .getTestResult(this.applicationReference, this.authenticationProvider.getEmployeeId())
      .pipe(
        map((response: HttpResponse<any>): string => response.body),
        map((data) => this.testResult = this.compressionProvider.extractTestResult(data)),
        tap(async () => this.handleLoadingUI(false)),
        catchError(async (err) => {
          this.store$.dispatch(SaveLog({
            payload: this.logHelper.createLog(
              LogType.ERROR,
              `Getting test result for app ref (${this.applicationReference})`,
              err,
            ),
          }));
          this.errorLink = ErrorTypes.SEARCH_RESULT;
          this.additionalErrorText = true;
          this.showErrorMessage = true;
          await this.handleLoadingUI(false);
          return of();
        }),
      ).subscribe();
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(ViewTestResultViewDidEnter(this.applicationReference));
  }

  ionViewDidLeave(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

    const startDate: moment.Moment = moment(get(this.testResult, 'journalData.testSlotAttributes.start'));

    return {
      date: startDate.format('dddd Do MMMM YYYY'),
      time: startDate.format('HH:mm'),
      applicationReference: formatApplicationReference(get(this.testResult, 'journalData.applicationReference')),
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
    };
  }

  getCandidateDetails(): { prn: number; attemptNumber: number; } {
    if (!this.testResult) {
      return null;
    }

    return {
      prn: get(this.testResult, 'journalData.candidate.prn'),
      attemptNumber: get(this.testResult, 'journalData.candidate.previousADITests'),
    };
  }

  getVehicleDetails(): string[] {
    if (!this.testResult || !this.isCategoryB()) {
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

  getTrainerData(): CatADI2UniqueTypes.TrainerDetails {
    if (!this.testResult) {
      return null;
    }

    return {
      orditTrainedCandidate: get(this.testResult, 'trainerDetails.orditTrainedCandidate'),
      trainingRecords: get(this.testResult, 'trainerDetails.trainingRecords'),
      trainerRegistrationNumber: get(this.testResult, 'trainerDetails.trainerRegistrationNumber'),
    };
  }

  isCategoryB = (): boolean => isAnyOf(this.testCategory, [TestCategory.B]);

  showDebriefCommonCard = (): boolean => isAnyOf(this.testCategory, [
    TestCategory.B, // Cat B
    TestCategory.BE, // Cat BE
    TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, // Cat A Mod 1
    TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, // Cat A Mod 2
    TestCategory.C, TestCategory.C1, TestCategory.C1E, TestCategory.CE, // Cat C3B
    TestCategory.CM, TestCategory.C1M, TestCategory.C1EM, TestCategory.CEM, // Cat C3A
    TestCategory.D, TestCategory.D1, TestCategory.D1E, TestCategory.DE, // Cat D3B
    TestCategory.DM, TestCategory.D1M, TestCategory.D1EM, TestCategory.DEM, // Cat D3A
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K, // Cat Home
    TestCategory.ADI2, // ADI
    TestCategory.CCPC, TestCategory.DCPC,
  ]);

  showVehicleDetailsCommonCard: () => boolean = () => isAnyOf(this.testCategory, [
    TestCategory.B, // Cat B
    TestCategory.BE, // Cat BE
    TestCategory.EUAMM1, TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, // Cat A Mod 1
    TestCategory.EUAMM2, TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, // Cat A Mod 2
    TestCategory.C, TestCategory.C1, TestCategory.C1E, TestCategory.CE, // Cat C 3B
    TestCategory.CM, TestCategory.C1M, TestCategory.C1EM, TestCategory.CEM, // Cat C 3A
    TestCategory.D, TestCategory.D1, TestCategory.D1E, TestCategory.DE, // Cat D 3B
    TestCategory.DM, TestCategory.D1M, TestCategory.D1EM, TestCategory.DEM, // Cat D 3A
    TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K, // Cat Home
    TestCategory.ADI2, // ADI
    TestCategory.CCPC, TestCategory.DCPC,
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
}
