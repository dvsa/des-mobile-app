import { lessonAndThemeReducer } from '@store/tests/test-data/cat-adi-part3/lesson-and-theme/lesson-and-theme.reducer';
import { LessonTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import * as lessonAndThemeActions from '../lesson-and-theme.actions';

describe('lessonAndThemeReducer', () => {
  describe('StudentLevelChanged', () => {
    it('should set student level to the value passed when called if'
      + ' it is not the same as the current student level', () => {
      const result = lessonAndThemeReducer(
        { studentLevel: 'trained' }, lessonAndThemeActions.StudentLevelChanged('partlyTrained'),
      );
      expect(result).toEqual({ studentLevel: 'partlyTrained' });
    });
    it('should set student level to null when called if'
      + ' the value passed is the same as the current student level', () => {
      const result = lessonAndThemeReducer(
        { studentLevel: 'trained' }, lessonAndThemeActions.StudentLevelChanged('trained'),
      );
      expect(result).toEqual({ studentLevel: null });
    });
  });
  describe('LessonThemeChanged', () => {
    it('should append lessonThemes with the value passed when called'
      + ' if it is not already included', () => {
      const result = lessonAndThemeReducer(
        { lessonThemes: ['ecoSafeDriving'] }, lessonAndThemeActions.LessonThemeChanged('junctions' as LessonTheme),
      );
      expect(result).toEqual({ lessonThemes: ['ecoSafeDriving', 'junctions'] });
    });
    it('should remove the value passed from lessonThemes when called'
      + ' if it is already included', () => {
      const result = lessonAndThemeReducer(
        { lessonThemes: ['ecoSafeDriving', 'junctions'] },
        lessonAndThemeActions.LessonThemeChanged('junctions' as LessonTheme),
      );
      expect(result).toEqual({ lessonThemes: ['ecoSafeDriving'] });
    });
  });
  describe('OtherChanged', () => {
    it('should set other to the value passed when called', () => {
      const result = lessonAndThemeReducer(
        { other: null }, lessonAndThemeActions.OtherChanged('test'),
      );
      expect(result).toEqual({ other: 'test' });
    });
  });
});
