import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LessonPlanning, RiskManagement, TeachingLearningStrategies } from '@dvsa/mes-test-schema/categories/ADI3';
import { IonCard, IonCardContent, IonCardHeader, IonCol, IonGrid, IonRow } from '@ionic/angular';
import { FormatIdPipe } from '@shared/pipes/format-id.pipe';
import { TestReportAssessmentAnswer } from '../tr-assessment-answer/tr-assessment-answer';

@Component({
  selector: 'tr-assessment-card',
  templateUrl: 'tr-assessment-card.html',
  imports: [IonCard, IonCardHeader, IonRow, IonCol, IonCardContent, IonGrid, TestReportAssessmentAnswer, FormatIdPipe],
})
export class TestReportAssessmentCard {
  @Input()
  sectionHeader: string;

  @Input()
  assessmentCard: string;

  @Input()
  showMissing = false;

  @Input()
  sectionData: LessonPlanning | RiskManagement | TeachingLearningStrategies;

  @Output()
  answerChange = new EventEmitter<{ question: number; answer: number }>();

  trAssessmentAnswerChange = (question: number, answer: string) => {
    this.answerChange.emit({ question, answer: answer === null ? null : Number(answer) });
  };
}
