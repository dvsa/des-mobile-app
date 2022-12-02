import { createAction, union } from '@ngrx/store';
import { LessonTheme, StudentLevel } from '@dvsa/mes-test-schema/categories/ADI3';

export const StudentLevelChanged = createAction(
  '[LessonAndTheme] Student level changed',
  (studentLevel: StudentLevel) => ({ studentLevel }),
);

export const LessonThemeChanged = createAction(
  '[LessonAndTheme] Lesson theme changed',
  (lessonTheme: LessonTheme) => ({ lessonTheme }),
);

export const LessonThemeAdded = createAction(
  '[LessonAndTheme] Lesson theme added',
  (lessonTheme: LessonTheme) => ({ lessonTheme }),
);

export const LessonThemeRemoved = createAction(
  '[LessonAndTheme] Lesson theme removed',
  (lessonTheme: LessonTheme) => ({ lessonTheme }),
);

export const OtherChanged = createAction(
  '[LessonAndTheme] Other changed',
  (other: string) => ({ other }),
);

const actions = union({
  StudentLevelChanged,
  LessonThemeChanged,
  LessonThemeAdded,
  LessonThemeRemoved,
  OtherChanged,
});

export type LessonAndThemeActions = typeof actions;
