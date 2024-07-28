import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { PipesModule } from '@shared/pipes/pipes.module';

import { CandidateDetailsComponentsModule } from '@pages/candidate-details/components/candidate-details-components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { DebriefCardComponent } from '@pages/view-test-result/components/debrief-card/debrief-card';
import { SafetyDataRowComponent } from '@pages/view-test-result/components/safety-question-data-row/safety-question-data-row';
import { ScDebriefCard } from '@pages/view-test-result/components/sc-debrief-card/sc-debrief-card';
import { TrainerDetailsCardComponent } from '@pages/view-test-result/components/trainer-details-card/trainer-details-card';
import { BusinessDetailsCardComponent } from './business-details-card/business-details-card';
import { ContactDetailsCardComponent } from './contact-details-card/contact-details-card';
import { DataRowWithListComponent } from './data-row-with-list/data-list-with-row';
import { ExaminerDetailsCardComponent } from './examiner-details-card/examiner-details';
import { FaultsDataRowComponent } from './faults-data-row/faults-data-row';
import { RekeyDetailsCardComponent } from './rekey-details-card/rekey-details';
import { RekeyReasonCardComponent } from './rekey-reason-card/rekey-reason';
import { SafetyAndBalanceDataRowComponent } from './safety-and-balance-data-row/safety-and-balance-data-row';
import { SpeedCardComponent } from './speed-card/speed-card';
import { TestDetailsCardComponent } from './test-details-card/test-details-card';
import { TestSummaryCardComponent } from './test-summary-card/test-summary-card';
import { VehicleChecksDataRowComponent } from './vehicle-checks-data-row/vehicle-checks-data-row';
import { VehicleDetailsCardComponent } from './vehicle-details-card/vehicle-details-card';
import { ViewTestHeaderComponent } from './view-test-header/view-test-header';

@NgModule({
	declarations: [
		DataRowWithListComponent,
		FaultsDataRowComponent,
		ViewTestHeaderComponent,
		TestDetailsCardComponent,
		ExaminerDetailsCardComponent,
		RekeyDetailsCardComponent,
		RekeyReasonCardComponent,
		VehicleChecksDataRowComponent,
		SafetyDataRowComponent,
		SafetyAndBalanceDataRowComponent,
		TestSummaryCardComponent,
		ContactDetailsCardComponent,
		BusinessDetailsCardComponent,
		VehicleDetailsCardComponent,
		DebriefCardComponent,
		SpeedCardComponent,
		TrainerDetailsCardComponent,
		ScDebriefCard,
	],
	imports: [
		CommonModule,
		IonicModule,
		ComponentsModule,
		PipesModule,
		CandidateDetailsComponentsModule,
		OfficeComponentsModule,
	],
	exports: [
		DataRowWithListComponent,
		FaultsDataRowComponent,
		ViewTestHeaderComponent,
		TestDetailsCardComponent,
		ExaminerDetailsCardComponent,
		RekeyDetailsCardComponent,
		RekeyReasonCardComponent,
		VehicleChecksDataRowComponent,
		SafetyAndBalanceDataRowComponent,
		SafetyDataRowComponent,
		TestSummaryCardComponent,
		ContactDetailsCardComponent,
		BusinessDetailsCardComponent,
		VehicleDetailsCardComponent,
		DebriefCardComponent,
		SpeedCardComponent,
		TrainerDetailsCardComponent,
		ScDebriefCard,
	],
})
export class ViewTestResultComponentsModule {}
