import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { CPCEndTestModalModule } from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal.module';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { AdditionalItemsComponent } from './additional-items/additional-items';
import { ModuleAssessmentComponent } from './module-assessment/module-assessment';
import { QuestionAnswerComponent } from './question-answer/question-answer';
import { QuestionCardComponent } from './question-card/question-card';
import { QuestionDelExRadioCardComponent } from './question-del-ex-radio-card/question-del-ex-radio-card';
import { QuestionFiveCardComponent } from './question-five-card/question-five-card';
import { QuestionFooterComponent } from './question-footer/question-footer';
import { QuestionScoreComponent } from './question-score/question-score';
import { QuestionSubtitleComponent } from './question-subtitle/question-subtitle';
import { QuestionTitleComponent } from './question-title/question-title';

@NgModule({
	declarations: [
		ModuleAssessmentComponent,
		QuestionCardComponent,
		QuestionFiveCardComponent,
		QuestionFooterComponent,
		AdditionalItemsComponent,
		QuestionTitleComponent,
		QuestionSubtitleComponent,
		QuestionAnswerComponent,
		QuestionScoreComponent,
		QuestionDelExRadioCardComponent,
	],
	imports: [
		CommonModule,
		ComponentsModule,
		TestReportComponentsModule,
		IonicModule,
		DirectivesModule,
		CPCEndTestModalModule,
		ReactiveFormsModule,
	],
	exports: [
		ModuleAssessmentComponent,
		QuestionCardComponent,
		QuestionFiveCardComponent,
		QuestionFooterComponent,
		AdditionalItemsComponent,
		QuestionTitleComponent,
		QuestionSubtitleComponent,
		QuestionAnswerComponent,
		QuestionScoreComponent,
		QuestionDelExRadioCardComponent,
	],
})
export class TestReportCatCPCComponentsModule {}
