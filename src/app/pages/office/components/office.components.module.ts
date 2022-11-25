import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import { ECOCardComponent } from '@pages/office/components/eco-card/eco-card.component';
import { DrivingFaultsComponent } from '@pages/office/components/driving-faults/driving-faults.component';
import { ETACardComponent } from '@pages/office/components/eta-card/eta-card.component';
import { FaultCommentComponent } from './fault-comment/fault-comment';
import { FaultCommentCardComponent } from './fault-comment-card/fault-comment-card';
import { RouteNumberComponent } from './route-number/route-number';
import { CandidateDescriptionComponent } from './candidate-description/candidate-description';
import { IdentificationComponent } from './identification/identification';
import { ShowMeQuestionComponent } from './show-me-question/show-me-question';
import { WeatherConditionsComponent } from './weather-conditions/weather-conditions';
import { AdditionalInformationComponent } from './additional-information/additional-information';
import { VehicleChecksOfficeCardComponent } from './vehicle-checks/vehicle-checks-office-card';
import { IndependentDrivingComponent } from './independent-driving/independent-driving';
import { CandidateSectionComponent } from './candidate-section/candidate-section';
import { DateOfTest } from './date-of-test/date-of-test';

@NgModule({
  declarations: [
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
  ],
})
export class OfficeComponentsModule { }
