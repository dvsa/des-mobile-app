import {
  TestData as CatADI3TestData,
  LessonAndTheme,
  LessonTheme,
  StudentLevel,
} from '@dvsa/mes-test-schema/categories/ADI3';
import { createSelector } from '@ngrx/store';
import { selectTestData } from '@store/tests/test-data/common/test-data.selector';

export const getStudentLevel = (lessonAndTheme: LessonAndTheme) => lessonAndTheme.studentLevel;
export const getLessonThemes = (lessonAndTheme: LessonAndTheme) => lessonAndTheme.lessonThemes;
export const getOther = (lessonAndTheme: LessonAndTheme) => lessonAndTheme.other;

export const selectLessonAndTheme = createSelector(
  selectTestData,
  (test): LessonAndTheme => (test as CatADI3TestData)?.lessonAndTheme
);

export const selectStudentLevel = createSelector(
  selectLessonAndTheme,
  (lessonAndTheme: LessonAndTheme): StudentLevel => lessonAndTheme.studentLevel
);

export const selectLessonThemes = createSelector(
  selectLessonAndTheme,
  (lessonAndTheme: LessonAndTheme): LessonTheme[] => lessonAndTheme.lessonThemes
);

export const selectOther = createSelector(
  selectLessonAndTheme,
  (lessonAndTheme: LessonAndTheme): string => lessonAndTheme.other
);
