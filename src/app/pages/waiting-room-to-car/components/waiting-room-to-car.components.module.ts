import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';

import { MotCardComponent } from '@pages/waiting-room-to-car/components/mot-components/mot-card/mot-card.component';
import { MotNoEvidenceConfirmationComponent } from '@pages/waiting-room-to-car/components/mot-components/mot-no-evidence-confirmation/mot-no-evidence-confirmation';
import { PracticeModeMOTModal } from '@pages/waiting-room-to-car/components/mot-components/practice-mode-mot-modal/mot-failed-modal.component';
import { PipesModule } from '@shared/pipes/pipes.module';
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
  declarations: [
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
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
    ReactiveFormsModule,
    IonicModule,
    PipesModule,
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
