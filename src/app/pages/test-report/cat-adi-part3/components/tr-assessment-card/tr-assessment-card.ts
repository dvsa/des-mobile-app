import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { LessonPlanning, RiskManagement, TeachingLearningStrategies } from '@dvsa/mes-test-schema/categories/ADI3';

@Component({
  selector: 'tr-assessment-card',
  templateUrl: 'tr-assessment-card.html',
})
export class TestReportAssessmentCard {

  @Input()
  sectionHeader: string;

  @Input()
  assessmentCard: string;

  @Input()
  sectionData: LessonPlanning | RiskManagement | TeachingLearningStrategies;

  @Output()
  answerChange = new EventEmitter<{ question: number; answer: number; }>();

  trAssessmentAnswerChange = (question: number, answer: string) => {
    this.answerChange.emit({ question, answer: (answer === null) ? null : Number(answer) });
  };
}
