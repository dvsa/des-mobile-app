import { createAction } from '@ngrx/store';

export const ImmediateDangerChanged = createAction(
  '[Review] Immediate danger changed',
  (immediateDanger: boolean) => ({ immediateDanger }),
);

export const SeekFurtherDevelopmentChanged = createAction(
  '[Review] Seek further development changed',
  (seekFurtherDevelopment: boolean) => ({ seekFurtherDevelopment }),
);

export const FeedbackChanged = createAction(
  '[Review] Feedback changed',
  (feedback: string) => ({ feedback }),
);
