import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StudentComponent } from '@pages/test-report/cat-adi-part3/components/student/student';
import {
  AssessmentAnswerComponent,
} from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';
import { LessonThemeComponent } from '@pages/test-report/cat-adi-part3/components/lesson-theme/lesson-theme';
import {
  TestReportAssessmentAnswer,
} from '@pages/test-report/cat-adi-part3/components/tr-assessment-answer/tr-assessment-answer';
import {
  TestReportAssessmentCard,
} from '@pages/test-report/cat-adi-part3/components/tr-assessment-card/tr-assessment-card';
import { PipesModule } from '@shared/pipes/pipes.module';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [
    StudentComponent,
    AssessmentAnswerComponent,
    LessonThemeComponent,
    TestReportAssessmentAnswer,
    TestReportAssessmentCard,
    Code4Modal,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
    IonicModule,
    DirectivesModule,
    ReactiveFormsModule,
    FormsModule,
    PipesModule,
  ],
  exports: [
    StudentComponent,
    AssessmentAnswerComponent,
    LessonThemeComponent,
    TestReportAssessmentAnswer,
    TestReportAssessmentCard,
    Code4Modal,
  ],
})
export class TestReportCatADIPart3ComponentsModule { }
