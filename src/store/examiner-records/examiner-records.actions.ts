import { createAction } from '@ngrx/store';

export const LoadExaminerRecordsPreferences = createAction('[AppComponent] Load examiner records preferences');

export const UnloadExaminerRecords = createAction('[AppComponent] Unload examiner records');

export const LoadExaminerRecordsFailure = createAction(
  '[AppComponent] Load examiner records failed',
  (reason: string) => ({ reason })
);
