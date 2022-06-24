import { createAction } from '@ngrx/store';
import { LessonTheme, StudentLevel } from '@dvsa/mes-test-schema/categories/ADI3';

export const StudentLevelChanged = createAction(
  '[LessonAndTheme] Student level changed',
  (studentLevel: StudentLevel) => ({ studentLevel }),
);

export const LessonThemeChanged = createAction(
  '[LessonAndTheme] Lesson theme changed',
  (lessonThemes: LessonTheme[]) => ({ lessonThemes }),
);

export const OtherChanged = createAction(
  '[LessonAndTheme] Other changed',
  (other: string) => ({ other }),
);
