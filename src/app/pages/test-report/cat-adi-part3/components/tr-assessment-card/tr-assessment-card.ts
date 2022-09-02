import {
  Component, EventEmitter, Input, Output,
} from '@angular/core';
import { LessonPlanning, RiskManagement, TeachingLearningStrategies } from '@dvsa/mes-test-schema/categories/ADI3';
import { FormGroup } from '@angular/forms';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { VehicleDetailsByCategoryProvider } from '@providers/vehicle-details-by-category/vehicle-details-by-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AlertController, Platform } from '@ionic/angular';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';

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

  @Input()
  form: FormGroup;

  trAssessmentAnswerChange = (question: number, answer: string) => {
    this.answerChange.emit({ question, answer: (answer === null) ? null : Number(answer) });
  };
}
