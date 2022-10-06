import { Component, Input } from '@angular/core';
import { LessonPlanning, RiskManagement, TeachingLearningStrategies } from '@dvsa/mes-test-schema/categories/ADI3';

@Component({
  selector: 'adi3-debrief-card-box',
  templateUrl: 'adi3-debrief-card-box.html',
  styleUrls: ['adi3-debrief-card-box.scss'],
})
export class Adi3DebriefCardBox {
  @Input()
  public title: string;

  @Input()
  public testReportSection: LessonPlanning | RiskManagement | TeachingLearningStrategies;

  @Input()
  idSelector:string;
}
