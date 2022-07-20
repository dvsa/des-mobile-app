import { Component, Input, OnInit } from '@angular/core';
import {
  LessonAndTheme,
  LessonPlanning,
  RiskManagement,
  TeachingLearningStrategies,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { studentValues, lessonThemeValues } from '@app/shared/constants/adi3-questions/lesson-theme.constants';

@Component({
  selector: 'adi3-debrief-card',
  templateUrl: 'adi3-debrief-card.html',
  styleUrls: ['adi3-debrief-card.scss'],
})
export class Adi3DebriefCard implements OnInit {
  @Input()
  public totalScore: number;

  @Input()
  public lessonTheme: LessonAndTheme;

  @Input()
  public lessonPlanning: LessonPlanning;

  @Input()
  public riskManagement: RiskManagement;

  @Input()
  public teachingLearningStrategies: TeachingLearningStrategies;

  studentValueConst = studentValues;
  lessonThemeValueConst: string[] = [];

  ngOnInit(): void {
    this.lessonTheme.lessonThemes.forEach((item) => {
      this.lessonThemeValueConst.push(lessonThemeValues[`${item}`]);
    });
  }

  displayGradeDescription(): string {
    let description: string = 'Unsatisfactory Performance';
    if (this.totalScore > 30 && this.totalScore < 43) {
      description = 'Sufficient competence demonstrated to permit entry to the Register of Approved Driving Instructors';
    } else if (this.totalScore > 43) {
      description = 'A high overall standard of instruction demonstrated';
    }
    return description;
  }
}
