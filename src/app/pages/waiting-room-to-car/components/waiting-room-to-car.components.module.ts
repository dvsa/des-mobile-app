import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  IonButton,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
} from '@ionic/angular';

import { RegistrationWithPreviousMotTextComponent } from '@components/common/registration-with-previous-mot-text/registration-with-previous-mot-text.component';
import { MotCardComponent } from '@pages/waiting-room-to-car/components/mot-components/mot-card/mot-card.component';
import { MotNoEvidenceConfirmationComponent } from '@pages/waiting-room-to-car/components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { PracticeModeMOTModal } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/practice-mode-mot-modal.component';
import { SafetyRecallComponent } from '@pages/waiting-room-to-car/components/safety-recall/safety-recall';

import { AccompanimentCardComponent } from './accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from './accompaniment/accompaniment';
import { CandidateDeclarationSignedComponent } from './candidate-declaration/candidate-declaration';
import { EyesightFailureConfirmationComponent } from './eyesight-failure-confirmation/eyesight-failure-confirmation';
import { EyesightTestComponent } from './eyesight-test/eyesight-test';
import { FullLicenceHeldComponent } from './full-licence-held-toggle/full-licence-held-toggle';
import { AlternateMotEvidenceComponent } from './mot-components/alternate-mot-evidence/alternate-mot-evidence.component';
import { MotFailedModal } from './mot-components/mot-failed-modal/mot-failed-modal.component';
import { TestCategoryComponent } from './test-category/test-category';
import { VehicleChecksToggleComponent } from './vehicle-checks-completed/vehicle-checks-completed';
import { VehicleChecksQuestionComponent } from './vehicle-checks-question/vehicle-checks-question';
import { VehicleChecksComponent } from './vehicle-checks/vehicle-checks';
import { VehicleDetailsCardComponent } from './vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details';
import { VehicleRegistrationComponent } from './vehicle-registration/vehicle-registration';

@NgModule({
  imports: [
    SafetyRecallComponent,
    CommonModule,
    ReactiveFormsModule,
    RegistrationWithPreviousMotTextComponent,
    IonInput,
    IonCol,
    IonButton,
    IonText,
    IonSpinner,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonIcon,
    IonGrid,
    EyesightTestComponent,
    EyesightFailureConfirmationComponent,
    VehicleRegistrationComponent,
    AccompanimentCardComponent,
    AccompanimentComponent,
    VehicleDetailsCardComponent,
    VehicleDetailsComponent,
    VehicleChecksToggleComponent,
    CandidateDeclarationSignedComponent,
    FullLicenceHeldComponent,
    TestCategoryComponent,
    VehicleChecksComponent,
    VehicleChecksQuestionComponent,
    MotCardComponent,
    MotFailedModal,
    PracticeModeMOTModal,
    AlternateMotEvidenceComponent,
    MotNoEvidenceConfirmationComponent,
  ],
  exports: [
    EyesightTestComponent,
    EyesightFailureConfirmationComponent,
    VehicleRegistrationComponent,
    AccompanimentCardComponent,
    AccompanimentComponent,
    VehicleDetailsCardComponent,
    VehicleDetailsComponent,
    VehicleChecksToggleComponent,
    CandidateDeclarationSignedComponent,
    FullLicenceHeldComponent,
    TestCategoryComponent,
    VehicleChecksComponent,
    VehicleChecksQuestionComponent,
    MotCardComponent,
    MotFailedModal,
    PracticeModeMOTModal,
    AlternateMotEvidenceComponent,
    MotNoEvidenceConfirmationComponent,
  ],
})
export class WaitingRoomToCarComponentsModule {}
