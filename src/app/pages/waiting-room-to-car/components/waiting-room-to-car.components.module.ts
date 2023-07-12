import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { PipesModule } from '@shared/pipes/pipes.module';

import { EyesightTestComponent } from './eyesight-test/eyesight-test';
import { EyesightFailureConfirmationComponent } from './eyesight-failure-confirmation/eyesight-failure-confirmation';
import { VehicleRegistrationComponent } from './vehicle-registration/vehicle-registration';
import { AccompanimentCardComponent } from './accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from './accompaniment/accompaniment';
import { VehicleDetailsCardComponent } from './vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details';
import { VehicleChecksToggleComponent } from './vehicle-checks-completed/vehicle-checks-completed';
import { CandidateDeclarationSignedComponent } from './candidate-declaration/candidate-declaration';
import { FullLicenceHeldComponent } from './full-licence-held-toggle/full-licence-held-toggle';
import { TestCategoryComponent } from './test-category/test-category';
import { VehicleChecksComponent } from './vehicle-checks/vehicle-checks';
import { VehicleChecksQuestionComponent } from './vehicle-checks-question/vehicle-checks-question';
import { MotDetailsDisplay } from './mot-details-display/mot-details-display';
import { MotInvalidModal } from './mot-invalid-modal/mot-invalid-modal';
import { AlternativeMotEvidence } from './alternative-mot-evidence/alternative-mot-evidence';
import { AlternativeMotEvidenceDetails } from './alternative-mot-evidence-details/alternative-mot-evidence-details';

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
    MotDetailsDisplay,
    MotInvalidModal,
    AlternativeMotEvidence,
    AlternativeMotEvidenceDetails,
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
    MotDetailsDisplay,
    MotInvalidModal,
    AlternativeMotEvidence,
    AlternativeMotEvidenceDetails,
  ],
})
export class WaitingRoomToCarComponentsModule {
}
