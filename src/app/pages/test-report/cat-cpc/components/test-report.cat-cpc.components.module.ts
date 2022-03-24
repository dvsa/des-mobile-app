import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  CPCEndTestModalModule,
} from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TestReportComponentsModule } from '../../components/test-report-components.module';
import { ModuleAssessmentComponent } from './module-assessment/module-assessment';
import { QuestionCardComponent } from './question-card/question-card';
import { QuestionFooterComponent } from './question-footer/question-footer';
import { AdditionalItemsComponent } from './additional-items/additional-items';
import { QuestionTitleComponent } from './question-title/question-title';
import { QuestionSubtitleComponent } from './question-subtitle/question-subtitle';
import { QuestionAnswerComponent } from './question-answer/question-answer';
import { QuestionFiveCardComponent } from './question-five-card/question-five-card';
import { QuestionScoreComponent } from './question-score/question-score';
import { QuestionDelExRadioCardComponent } from './question-del-ex-radio-card/question-del-ex-radio-card';

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
export class TestReportCatCPCComponentsModule { }
