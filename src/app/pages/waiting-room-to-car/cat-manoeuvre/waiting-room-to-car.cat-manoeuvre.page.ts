import { Component, OnInit, computed } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';

import { NgClass } from '@angular/common';
import { OfflineBannerComponent } from '@components/common/offline-banner/offline-banner';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
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
import { WaitingRoomToCarBasePageComponent } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getVehicleDetails } from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.reducer';
import {
  getNumberOfSeats,
  getVehicleHeight,
  getVehicleLength,
  getVehicleWidth,
} from '@store/tests/vehicle-details/cat-manoeuvres/vehicle-details.cat-manoeuvre.selector';
import { MotEvidenceProvidedReset } from '@store/tests/vehicle-details/vehicle-details.actions';
import { AccompanimentCardComponent } from '../components/accompaniment-card/accompaniment-card';
import { MotNoEvidenceConfirmationComponent } from '../components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { TestCategoryComponent } from '../components/test-category/test-category';
import { VehicleRegistrationComponent } from '../components/vehicle-registration/vehicle-registration';
import { DimensionsComponent } from './components/dimensions/dimensions';

@Component({
  selector: 'app-waiting-room-to-car-cat-manoeuvre',
  templateUrl: './waiting-room-to-car.cat-manoeuvre.page.html',
  styleUrls: ['./waiting-room-to-car.cat-manoeuvre.page.scss'],
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
    TestCategoryComponent,
    DimensionsComponent,
    AccompanimentCardComponent,
    WarningBannerComponent,
    IonFooter,
    IonButton,
    IonText,
  ],
})
export class WaitingRoomToCarCatManoeuvrePage extends WaitingRoomToCarBasePageComponent implements OnInit {
  form: UntypedFormGroup;
  vehicleLength = computed(() => getVehicleLength(getVehicleDetails(this.currentTest())));
  vehicleWidth = computed(() => getVehicleWidth(getVehicleDetails(this.currentTest())));
  vehicleHeight = computed(() => getVehicleHeight(getVehicleDetails(this.currentTest())));
  numberOfSeats = computed(() => getNumberOfSeats(getVehicleDetails(this.currentTest())));
  fullLicenceHeld: boolean = null;

  constructor() {
    super();
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();
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
        replaceUrl: false,
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
