import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonRow } from '@ionic/angular';
import { AssessmentAnswerComponent } from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';
import { Code4ModalModule } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal.module';
import { LessonThemeComponent } from '@pages/test-report/cat-adi-part3/components/lesson-theme/lesson-theme';
import { StudentComponent } from '@pages/test-report/cat-adi-part3/components/student/student';
import { TestReportAssessmentAnswer } from '@pages/test-report/cat-adi-part3/components/tr-assessment-answer/tr-assessment-answer';
import { TestReportAssessmentCard } from '@pages/test-report/cat-adi-part3/components/tr-assessment-card/tr-assessment-card';

import { TestReportComponentsModule } from '../../components/test-report-components.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    TestReportComponentsModule,
    ReactiveFormsModule,
    FormsModule,
    Code4ModalModule,
    IonCol,
    IonRow,
    IonGrid,
    IonCardContent,
    IonCardHeader,
    IonCard,
    StudentComponent,
    AssessmentAnswerComponent,
    LessonThemeComponent,
    TestReportAssessmentAnswer,
    TestReportAssessmentCard,
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
