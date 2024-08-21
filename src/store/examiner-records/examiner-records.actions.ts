import { createAction } from '@ngrx/store';

export const LoadExaminerRecordsPreferences = createAction('[AppComponent] Load examiner records preferences');

export const LoadExaminerRecordsFailure = createAction(
  '[AppComponent] Load examiner records failed',
  (reason: string) => ({ reason })
);
