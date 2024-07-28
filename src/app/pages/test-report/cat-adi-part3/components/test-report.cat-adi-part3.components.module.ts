import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { IonicModule } from '@ionic/angular';
import { AssessmentAnswerComponent } from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';
import { Code4ModalModule } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal.module';
import { LessonThemeComponent } from '@pages/test-report/cat-adi-part3/components/lesson-theme/lesson-theme';
import { StudentComponent } from '@pages/test-report/cat-adi-part3/components/student/student';
import { TestReportAssessmentAnswer } from '@pages/test-report/cat-adi-part3/components/tr-assessment-answer/tr-assessment-answer';
import { TestReportAssessmentCard } from '@pages/test-report/cat-adi-part3/components/tr-assessment-card/tr-assessment-card';
import { PipesModule } from '@shared/pipes/pipes.module';
import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  declarations: [
    StudentComponent,
    AssessmentAnswerComponent,
    LessonThemeComponent,
    TestReportAssessmentAnswer,
    TestReportAssessmentCard,
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
    Code4ModalModule,
  ],
  exports: [
    StudentComponent,
    AssessmentAnswerComponent,
    LessonThemeComponent,
    TestReportAssessmentAnswer,
    TestReportAssessmentCard,
  ],
})
export class TestReportCatADIPart3ComponentsModule {}
