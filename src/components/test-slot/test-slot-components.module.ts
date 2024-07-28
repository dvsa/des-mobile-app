import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { AutosaveStatusComponent } from '@components/test-slot/autosave-status/autosave-status';
import { IntegrityMarkerComponent } from '@components/test-slot/integrity-marker/integrity-marker';
import { IonicModule } from '@ionic/angular';
import { AdditionalCandidateDetailsComponent } from './additional-candidate-details/additional-candidate-details';
import { CandidateLinkComponent } from './candidate-link/candidate-link';
import { DateComponent } from './date/date';
import { ExaminerNameComponent } from './examiner-name/examiner-name';
import { IndicatorsComponent } from './indicators/indicators';
import { LanguageComponent } from './language/language';
import { LocationComponent } from './location/location';
import { ProgressiveAccessComponent } from './progressive-access/progressive-access';
import { SubmissionStatusComponent } from './submission-status/submission-status';
import { TestCategoryComponent } from './test-category/test-category';
import { TestOutcomeComponent } from './test-outcome/test-outcome';
import { TestSlotComponent } from './test-slot/test-slot';
import { TimeComponent } from './time/time';
import { VehicleDetailsComponent } from './vehicle-details/vehicle-details';

@NgModule({
	declarations: [
		AdditionalCandidateDetailsComponent,
		AutosaveStatusComponent,
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
		ExaminerNameComponent,
		IntegrityMarkerComponent,
	],
	imports: [CommonModule, IonicModule, ComponentsModule],
	exports: [
		AdditionalCandidateDetailsComponent,
		AutosaveStatusComponent,
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
		ExaminerNameComponent,
		IntegrityMarkerComponent,
	],
})
export class TestSlotComponentsModule {}
