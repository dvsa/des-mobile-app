import { Component, Input, OnInit } from '@angular/core';
import {
  LessonAndTheme,
  LessonPlanning, Review,
  RiskManagement,
  TeachingLearningStrategies,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { lessonThemeValues } from '@app/shared/constants/adi3-questions/lesson-theme.constants';

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

  lessonThemeValueStr: string = '';
  isTerminated: boolean = false;

  ngOnInit(): void {
    // @TODO map((theme) => isEnglish ? lessonThemeValues[theme] : lessonThemeValuesWelsh[theme])
    this.lessonThemeValueStr = this.lessonTheme.lessonThemes
      .map((theme) => lessonThemeValues[theme])
      .concat(this.lessonTheme.other || null)
      .filter((theme) => theme && theme !== 'Other')
      .join(', ');
  }

  get displayGradeDescription(): string {
    switch (this.grade) {
      case 'B':
      case 'A':
        return this.grade;
      default:
        return 'unsatisfactory';
    }
  }
}
