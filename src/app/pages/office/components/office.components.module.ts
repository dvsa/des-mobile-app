import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { DrivingFaultsComponent } from '@pages/office/components/driving-faults/driving-faults.component';
import { ECOCardComponent } from '@pages/office/components/eco-card/eco-card.component';
import { ETACardComponent } from '@pages/office/components/eta-card/eta-card.component';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { OfficeFooterComponent } from '@pages/office/components/office-footer/office-footer.component';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AdditionalInformationComponent } from './additional-information/additional-information';
import { CandidateDescriptionComponent } from './candidate-description/candidate-description';
import { CandidateSectionComponent } from './candidate-section/candidate-section';
import { DateOfTest } from './date-of-test/date-of-test';
import { FaultCommentCardComponent } from './fault-comment-card/fault-comment-card';
import { FaultCommentComponent } from './fault-comment/fault-comment';
import { IdentificationComponent } from './identification/identification';
import { IndependentDrivingComponent } from './independent-driving/independent-driving';
import { RouteNumberComponent } from './route-number/route-number';
import { ShowMeQuestionComponent } from './show-me-question/show-me-question';
import { VehicleChecksOfficeCardComponent } from './vehicle-checks/vehicle-checks-office-card';
import { WeatherConditionsComponent } from './weather-conditions/weather-conditions';
import {
  AlternateEvidenceDescriptionComponent
} from './alternate-mot-evidence-description/alternate-evidence-description.component';
import {
  AlternateEvidenceProvidedComponent
} from '@pages/office/components/alternate-mot-evidence-provided/alternate-evidence-provided.component';

@NgModule({
  declarations: [
    OfficeFooterComponent,
    FaultCommentComponent,
    FaultCommentCardComponent,
    RouteNumberComponent,
    CandidateDescriptionComponent,
    IdentificationComponent,
    IndependentDrivingComponent,
    ShowMeQuestionComponent,
    WeatherConditionsComponent,
    AdditionalInformationComponent,
    VehicleChecksOfficeCardComponent,
    CandidateSectionComponent,
    DateOfTest,
    FinishTestModal,
    TrueLikenessComponent,
    ECOCardComponent,
    DrivingFaultsComponent,
    ETACardComponent,
    AlternateEvidenceDescriptionComponent,
    AlternateEvidenceProvidedComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
    IonicModule,
    FormsModule,
    PipesModule,
    ReactiveFormsModule,
  ],
  exports: [
    OfficeFooterComponent,
    FaultCommentComponent,
    FaultCommentCardComponent,
    RouteNumberComponent,
    CandidateDescriptionComponent,
    IdentificationComponent,
    IndependentDrivingComponent,
    ShowMeQuestionComponent,
    WeatherConditionsComponent,
    AdditionalInformationComponent,
    VehicleChecksOfficeCardComponent,
    CandidateSectionComponent,
    DateOfTest,
    FinishTestModal,
    TrueLikenessComponent,
    ECOCardComponent,
    DrivingFaultsComponent,
    ETACardComponent,
    AlternateEvidenceDescriptionComponent,
    AlternateEvidenceProvidedComponent
  ],
})
export class OfficeComponentsModule {}
