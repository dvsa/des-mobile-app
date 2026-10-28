import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { SafetyAndBalanceQuestions } from '@dvsa/mes-test-schema/categories/AM2';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';
import { select } from '@ngrx/store';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { SafetyQuestionsScore } from '@shared/models/safety-questions-score.model';
import { getSafetyAndBalanceQuestions } from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.selector';
import { MotEvidenceProvidedReset } from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BikeCategoryTypeComponent } from '../../../../components/common/bike-category-type/bike-category-type';
import { OfflineBannerComponent } from '../../../../components/common/offline-banner/offline-banner';
import { TestFlowHeaderComponent } from '../../../../components/common/test-flow-header/test-flow-header.component';
import { TransmissionComponent } from '../../../../components/common/transmission/transmission';
import { AccompanimentCardComponent } from '../components/accompaniment-card/accompaniment-card';
import { EyesightFailureConfirmationComponent } from '../components/eyesight-failure-confirmation/eyesight-failure-confirmation';
import { EyesightTestComponent } from '../components/eyesight-test/eyesight-test';
import { MotNoEvidenceConfirmationComponent } from '../components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { VehicleDetailsCardComponent } from '../components/vehicle-details-card/vehicle-details-card';
import { VehicleRegistrationComponent } from '../components/vehicle-registration/vehicle-registration';
import { VehicleChecksCatAMod2Component } from './components/vehicle-checks/vehicle-checks';

interface CatMod2WaitingRoomToCarPageState {
  schoolBike$: Observable<boolean>;
  safetyAndBalanceQuestionsScore$: Observable<SafetyQuestionsScore>;
  safetyAndBalanceQuestions$: Observable<SafetyAndBalanceQuestions>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatMod2WaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-a-mod2',
  templateUrl: './waiting-room-to-car.cat-a-mod2.page.html',
  styleUrls: ['./waiting-room-to-car.cat-a-mod2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    NgClass,
    TestFlowHeaderComponent,
    IonContent,
    OfflineBannerComponent,
    FormsModule,
    ReactiveFormsModule,
    IonGrid,
    IonRow,
    IonCol,
    BikeCategoryTypeComponent,
    TransmissionComponent,
    EyesightTestComponent,
    EyesightFailureConfirmationComponent,
    VehicleRegistrationComponent,
    MotNoEvidenceConfirmationComponent,
    VehicleChecksCatAMod2Component,
    AccompanimentCardComponent,
    VehicleDetailsCardComponent,
    IonFooter,
    IonButton,
    IonText,
    AsyncPipe,
  ],
})
export class WaitingRoomToCarCatAMod2Page extends WaitingRoomToCarBasePageComponent implements OnInit {
  pageState: WaitingRoomToCarPageState;
  form: UntypedFormGroup;
  submitClicked: boolean;

  constructor(injector: Injector) {
    super(injector);
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      schoolBike$: currentTest$.pipe(select(getVehicleDetails), select(getSchoolBike)),
      safetyAndBalanceQuestionsScore$: currentTest$.pipe(
        select(getTestData),
        select(getSafetyAndBalanceQuestions),
        map((safetyAndBalanceQuestions) =>
          this.faultCountProvider.getSafetyAndBalanceFaultCount(TestCategory.EUAM2, safetyAndBalanceQuestions)
        )
      ),
      safetyAndBalanceQuestions$: currentTest$.pipe(select(getTestData), select(getSafetyAndBalanceQuestions)),
    };
  }

  motNoEvidenceCancelled = (): void => {
    this.form.get('alternateEvidenceCtrl')?.reset();
    this.store$.dispatch(MotEvidenceProvidedReset());
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory, {
        replaceUrl: true,
      });
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });

    this.submitClicked = true;
  };

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')?.reset();
    this.store$.dispatch(EyesightTestReset());
  };
}
