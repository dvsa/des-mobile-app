import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CandidateLinkComponent } from './candidate-link/candidate-link';
import { IndicatorsComponent } from './indicators/indicators';
import { LanguageComponent } from './language/language';
import { ProgressiveAccessComponent } from './progressive-access/progressive-access';
import { SubmissionStatusComponent } from './submission-status/submission-status';
import { TestCategoryComponent } from './test-category/test-category';
import { TestOutcomeComponent } from './test-outcome/test-outcome';
import { TestSlotComponent } from './test-slot/test-slot';
import { TimeComponent } from './time/time';
import { DateComponent } from './date/date';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details';
import { LocationComponent } from './location/location';
import { AdditionalCandidateDetailsComponent } from './additional-candidate-details/additional-candidate-details';

@NgModule({
  declarations: [
    AdditionalCandidateDetailsComponent,
    CandidateLinkComponent,
    IndicatorsComponent,
    LanguageComponent,
    ProgressiveAccessComponent,
    SubmissionStatusComponent,
    TestCategoryComponent,
    TestOutcomeComponent,
    TestSlotComponent,
    TimeComponent,
    DateComponent,
    VehicleDetailsComponent,
    LocationComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
  ],
  entryComponents: [
    TestSlotComponent,
  ],
  exports: [
    AdditionalCandidateDetailsComponent,
    CandidateLinkComponent,
    IndicatorsComponent,
    LanguageComponent,
    ProgressiveAccessComponent,
    SubmissionStatusComponent,
    TestCategoryComponent,
    TestOutcomeComponent,
    TestSlotComponent,
    TimeComponent,
    DateComponent,
    VehicleDetailsComponent,
    LocationComponent,
  ],
})
export class TestSlotComponentsModule { }
