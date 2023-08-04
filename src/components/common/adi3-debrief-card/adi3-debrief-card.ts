import { Component, Input, OnInit } from '@angular/core';
import {
  LessonAndTheme,
  LessonPlanning,
  Review,
  RiskManagement,
  TeachingLearningStrategies,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { lessonThemeValues, studentValues } from '@app/shared/constants/adi3-questions/lesson-theme.constants';

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

  @Input()
  public grade: string = null;

  @Input()
  public review: Review;

  @Input()
  public testCategory: TestCategory;

  studentValueConst = studentValues;
  lessonThemeValueStr: string = '';

  ngOnInit(): void {
    this.lessonThemeValueStr = this.lessonTheme.lessonThemes
      .map((theme) => lessonThemeValues[theme])
      .concat(this.lessonTheme.other || null)
      .filter((theme) => theme && theme !== 'Other')
      .join(', ');
  }

  displayGradeDescription(): string {
    switch (this.grade) {
      case 'B':
        return (this.testCategory === TestCategory.ADI3)
          ? 'Sufficient competence demonstrated to permit entry to the Register of Approved Driving Instructors'
          : 'Sufficient competence demonstrated to retain entry on the Register of Approved Driving Instructors';
      case 'A':
        return 'A high overall standard of instruction demonstrated';
      default:
        return 'Unsatisfactory Performance';
    }
  }
}
