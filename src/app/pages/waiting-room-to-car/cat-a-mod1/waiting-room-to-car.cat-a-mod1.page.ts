import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AsyncPipe, NgClass } from '@angular/common';
import { BikeCategoryTypeComponent } from '@components/common/bike-category-type/bike-category-type';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TransmissionComponent } from '@components/common/transmission/transmission';
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
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getSchoolBike } from '@store/tests/vehicle-details/cat-a-mod1/vehicle-details.cat-a-mod1.selector';
import { MotEvidenceProvidedReset } from '@store/tests/vehicle-details/vehicle-details.actions';
import { getVehicleDetails } from '@store/tests/vehicle-details/vehicle-details.reducer';
import { isAutomatic, isManual } from '@store/tests/vehicle-details/vehicle-details.selector';
import { AccompanimentCardComponent } from '../components/accompaniment-card/accompaniment-card';
import { MotNoEvidenceConfirmationComponent } from '../components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { VehicleDetailsCardComponent } from '../components/vehicle-details-card/vehicle-details-card';
import { VehicleRegistrationComponent } from '../components/vehicle-registration/vehicle-registration';

interface CatMod1WaitingRoomToCarPageState {
  schoolBike$: Observable<boolean>;
  gearboxAutomaticRadioChecked$: Observable<boolean>;
  gearboxManualRadioChecked$: Observable<boolean>;
}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatMod1WaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-a-mod1',
  templateUrl: './waiting-room-to-car.cat-a-mod1.page.html',
  styleUrls: ['./waiting-room-to-car.cat-a-mod1.page.scss'],
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
    VehicleRegistrationComponent,
    MotNoEvidenceConfirmationComponent,
    AccompanimentCardComponent,
    VehicleDetailsCardComponent,
    IonFooter,
    IonButton,
    IonText,
    AsyncPipe,
  ],
})
export class WaitingRoomToCarCatAMod1Page extends WaitingRoomToCarBasePageComponent implements OnInit {
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
      schoolBike$: currentTest$.pipe(select(getVehicleDetails), select(getSchoolBike)),
      gearboxAutomaticRadioChecked$: currentTest$.pipe(select(getVehicleDetails), map(isAutomatic)),
      gearboxManualRadioChecked$: currentTest$.pipe(select(getVehicleDetails), map(isManual)),
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
  };
}
