import { TestBed } from '@angular/core/testing';
import { ADI3AssessmentProvider } from '@providers/adi3-assessment/adi3-assessment';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ADI3AssessmentProvider', () => {
  let adi3AssessmentProvider: ADI3AssessmentProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ADI3AssessmentProvider],
    });

    adi3AssessmentProvider = TestBed.inject(ADI3AssessmentProvider);
  });

  describe('validateTestReport', () => {
    it('should return the correct amount of completed Questions using the parameters', () => {
      expect(
        adi3AssessmentProvider.validateTestReport(
          {
            q1: {
              title: 'title1',
              score: 1,
            },
            score: 1,
          },
          {
            q1: {
              title: 'title2',
              score: 2,
            },
            q2: {
              title: 'title3',
              score: 3,
            },
            score: 5,
          },
          {
            q1: {
              title: 'title4',
              score: 4,
            },
            q2: {
              title: 'title5',
              score: 5,
            },
            q3: {
              title: 'title6',
              score: 6,
            },
            score: 15,
          }
        )
      ).toEqual(6);
    });
  });

  describe('isTestReportPopulated', () => {
    it(
      'should return true if validateTestReport returns 17,' +
        'studentLevel is present, lessonAndTheme.other is present and feedback is present',
      () => {
        vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(17);
        expect(
          adi3AssessmentProvider.isTestReportPopulated({
            lessonPlanning: null,
            riskManagement: null,
            teachingLearningStrategies: null,
            lessonAndTheme: {
              lessonThemes: [],
              studentLevel: 'beginner',
              other: 'other',
            },
            review: { feedback: 'feedback' },
          })
        ).toEqual(true);
      }
    );
    it(
      'should return true if validateTestReport returns 17,' +
        'studentLevel is present, the length of lessonAndTheme.lessonThemes is more than 0' +
        'and feedback is present',
      () => {
        vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(17);
        expect(
          adi3AssessmentProvider.isTestReportPopulated({
            lessonPlanning: null,
            riskManagement: null,
            teachingLearningStrategies: null,
            lessonAndTheme: {
              lessonThemes: ['junctions'],
              studentLevel: 'beginner',
            },
            review: { feedback: 'feedback' },
          })
        ).toEqual(true);
      }
    );
    it(
      'should return false if validateTestReport returns 16,' +
        'studentLevel is present, the length of lessonAndTheme.lessonThemes is more than 0' +
        'and feedback is present',
      () => {
        vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(16);
        expect(
          adi3AssessmentProvider.isTestReportPopulated({
            lessonPlanning: null,
            riskManagement: null,
            teachingLearningStrategies: null,
            lessonAndTheme: {
              lessonThemes: ['junctions'],
              studentLevel: 'beginner',
            },
            review: { feedback: 'feedback' },
          })
        ).toEqual(false);
      }
    );
    it(
      'should return false if validateTestReport returns 16,' +
        'studentLevel is present, the length of lessonAndTheme.lessonThemes is 0' +
        'and feedback is present',
      () => {
        vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(16);
        expect(
          adi3AssessmentProvider.isTestReportPopulated({
            lessonPlanning: null,
            riskManagement: null,
            teachingLearningStrategies: null,
            lessonAndTheme: {
              lessonThemes: [],
              studentLevel: 'beginner',
            },
            review: { feedback: 'feedback' },
          })
        ).toEqual(false);
      }
    );
    it(
      'should return false if validateTestReport returns 16,' +
        'studentLevel is present, the length of lessonAndTheme.lessonThemes is more than 0' +
        'and feedback is not present',
      () => {
        vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(16);
        expect(
          adi3AssessmentProvider.isTestReportPopulated({
            lessonPlanning: null,
            riskManagement: null,
            teachingLearningStrategies: null,
            lessonAndTheme: {
              lessonThemes: ['junctions'],
              studentLevel: 'beginner',
            },
          })
        ).toEqual(false);
      }
    );
    it(
      'should return false if validateTestReport returns 17,' +
        'studentLevel is not present, the length of lessonAndTheme.lessonThemes is more than 0' +
        'and feedback is present',
      () => {
        vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(17);
        expect(
          adi3AssessmentProvider.isTestReportPopulated({
            lessonPlanning: null,
            riskManagement: null,
            teachingLearningStrategies: null,
            lessonAndTheme: { lessonThemes: ['junctions'] },
            review: { feedback: 'feedback' },
          })
        ).toEqual(false);
      }
    );
  });

  describe('countScoreIfTouched', () => {
    it('should return `-` if validateTestReport returns 0', () => {
      vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(0);
      const result = adi3AssessmentProvider.countScoreIfTouched({});
      expect(result).toBe('-');
    });

    it('should return `score` if validateTestReport returns other then 0', () => {
      vi.spyOn(adi3AssessmentProvider, 'validateTestReport').mockReturnValue(1);
      vi.spyOn(adi3AssessmentProvider, 'getTotalAssessmentScore').mockReturnValue(3);
      const result = adi3AssessmentProvider.countScoreIfTouched({});
      expect(result).toBe(3);
    });
  });
});
