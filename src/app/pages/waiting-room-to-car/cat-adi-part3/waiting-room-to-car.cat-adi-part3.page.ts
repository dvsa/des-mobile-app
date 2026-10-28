import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AsyncPipe, NgClass } from '@angular/common';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
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
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { DateTime } from '@shared/helpers/date-time';
import { TrainerAccompanimentToggled } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.actions';
import { getAccompaniment } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.reducer';
import { getTrainerAccompaniment } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.selector';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import {
  getOrditTrained,
  getTrainerRegistrationNumber,
} from '@store/tests/trainer-details/cat-adi-part2/trainer-details.cat-adi-part2.selector';
import {
  PDILogbook,
  TraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.actions';
import { getTrainerDetails } from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.reducer';
import {
  getPDILogbook,
  getTraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.selector';
import {
  DualControlsToggledNo,
  DualControlsToggledYes,
  MotEvidenceProvidedReset,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import { OrditTrainerCatAdiPart2Component } from '../cat-adi-part2/components/ordit-trainer/ordit-trainer.cat-adi-part2';
import { TrainerRegistrationNumberCatAdiPart2Component } from '../cat-adi-part2/components/trainer-registration-number/trainer-registration-number.cat-adi-part2';
import { MotNoEvidenceConfirmationComponent } from '../components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { SafetyRecallComponent } from '../components/safety-recall/safety-recall';
import { TestCategoryComponent } from '../components/test-category/test-category';
import { VehicleRegistrationComponent } from '../components/vehicle-registration/vehicle-registration';
import { AccompanimentCardADI3Component } from './components/accompaniment-card/accompaniment-card';
import { DualControlsComponent } from './components/dual-controls/dual-controls';
import { TraineeLicenceComponent } from './components/trainee-licence/trainee-licence';

interface CatAdi3WaitingRoomToCarPageState {
  orditTrained$: Observable<boolean>;
  trainerRegistrationNumber$: Observable<number>;
  pdiLogbook$: Observable<boolean>;
  traineeLicence$: Observable<boolean>;
  trainerAccompaniment$: Observable<boolean>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatAdi3WaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-adi-part3',
  templateUrl: './waiting-room-to-car.cat-adi-part3.page.html',
  styleUrls: ['./waiting-room-to-car.cat-adi-part3.page.scss'],
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
    VehicleRegistrationComponent,
    MotNoEvidenceConfirmationComponent,
    SafetyRecallComponent,
    TestCategoryComponent,
    DualControlsComponent,
    TransmissionComponent,
    TraineeLicenceComponent,
    OrditTrainerCatAdiPart2Component,
    AccompanimentCardADI3Component,
    TrainerRegistrationNumberCatAdiPart2Component,
    IonFooter,
    IonButton,
    IonText,
    AsyncPipe,
  ],
})
export class WaitingRoomToCarCatADIPart3Page extends WaitingRoomToCarBasePageComponent implements OnInit {
  pageState: WaitingRoomToCarPageState;
  form: UntypedFormGroup;

  constructor(injector: Injector) {
    super(injector);
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      orditTrained$: currentTest$.pipe(select(getTrainerDetails), select(getOrditTrained)),
      trainerRegistrationNumber$: currentTest$.pipe(select(getTrainerDetails), select(getTrainerRegistrationNumber)),
      pdiLogbook$: currentTest$.pipe(select(getTrainerDetails), select(getPDILogbook)),
      traineeLicence$: currentTest$.pipe(select(getTrainerDetails), select(getTraineeLicence)),
      trainerAccompaniment$: currentTest$.pipe(select(getAccompaniment), select(getTrainerAccompaniment)),
    };
  }

  motNoEvidenceCancelled = (): void => {
    this.form.get('alternateEvidenceCtrl')?.reset();
    this.store$.dispatch(MotEvidenceProvidedReset());
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      if (this.testCategory === TestCategory.SC) {
        const startTime = new DateTime().toISOString();
        const endTime = new DateTime().add(45, 'minutes').toISOString();
        this.store$.dispatch(StartTimeChanged(startTime));
        this.store$.dispatch(EndTimeChanged(endTime));
      }
      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_DASHBOARD_PAGE);
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });
  };

  dualControlsOutcomeToggled(dualControls: boolean): void {
    this.store$.dispatch(dualControls ? DualControlsToggledYes() : DualControlsToggledNo());
  }

  pdiLogbookChanged(pdiLogbook: boolean): void {
    this.store$.dispatch(PDILogbook(pdiLogbook));
  }

  traineeLicenceChanged(pdiLogbook: boolean): void {
    this.store$.dispatch(TraineeLicence(pdiLogbook));
  }

  trainerAccompanimentChanged(): void {
    this.store$.dispatch(TrainerAccompanimentToggled());
  }

  notSC(category: CategoryCode): boolean {
    return category !== TestCategory.SC;
  }
}
