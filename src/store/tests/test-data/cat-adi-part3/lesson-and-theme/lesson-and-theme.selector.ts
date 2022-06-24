import { LessonAndTheme } from '@dvsa/mes-test-schema/categories/ADI3';

export const getStudentLevel = (lessonAndTheme: LessonAndTheme) => lessonAndTheme.studentLevel;
export const getLessonThemes = (lessonAndTheme: LessonAndTheme) => lessonAndTheme.lessonThemes;
export const getOther = (lessonAndTheme: LessonAndTheme) => lessonAndTheme.other;
