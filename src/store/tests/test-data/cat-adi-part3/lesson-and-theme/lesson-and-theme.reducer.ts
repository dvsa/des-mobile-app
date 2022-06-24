import { LessonAndTheme } from '@dvsa/mes-test-schema/categories/ADI3';
import { createFeatureSelector, createReducer, on } from '@ngrx/store';
import * as lessonAndThemeActions from './lesson-and-theme.actions';

export const initialState: LessonAndTheme = {
  studentLevel: null,
  lessonThemes: [],
  other: null,
};

export const lessonAndThemeReducer = createReducer(
  initialState,
  on(lessonAndThemeActions.StudentLevelChanged, (state, { studentLevel }): LessonAndTheme => ({
    ...state,
    studentLevel,
  })),
  on(lessonAndThemeActions.LessonThemeChanged, (state, { lessonThemes }): LessonAndTheme => ({
    ...state,
    lessonThemes,
  })),
  on(lessonAndThemeActions.OtherChanged, (state, { other }): LessonAndTheme => ({
    ...state,
    other,
  })),
);

export const getLessonAndTheme = createFeatureSelector<LessonAndTheme>('lessonAndTheme');
