import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { createAction, props } from '@ngrx/store';
import { ConnectionStatus } from '../../app/providers/network-state/network-state';
import { ExaminerSlotItemsByDate } from './journal.model';
import { MesError } from '../../app/shared/models/mes-error.model';

export const EarlyStartModalDidEnter = createAction(
  '[JournalPage] Early Start Modal Entered',
);

export const EarlyStartDidContinue = createAction(
  '[JournalPage] Early Start Modal Exited - Continue to Test',
);

export const EarlyStartDidReturn = createAction(
  '[JournalPage] Early Start Modal Exited - Return to Journal',
);

export const LoadJournal = createAction(
  '[JournalPage] Load Journal',
);

export const LoadJournalSilent = createAction(
  '[JournalPage] Load Journal Silent',
);

export const LoadJournalSuccess = createAction(
  '[JournalPage] Load Journal Success',
  props<{
    payload: ExaminerSlotItemsByDate,
    onlineOffline: ConnectionStatus,
    unAuthenticatedMode: boolean,
    lastRefreshed: Date
  }>(),
);

export const LoadJournalFailure = createAction(
  '[JournalEffects] Load Journal Failure',
  props<{ error: MesError }>(),
);

export const LoadJournalSilentFailure = createAction(
  '[JournalEffects] Load Journal Silent Failure',
  props<{ error: MesError }>(),
);

export const UnloadJournal = createAction(
  '[JournalPage] Unload Journal',
);

export const LoadCompletedTests = createAction(
  '[JournalEffect] Load Completed Tests',
);

export const LoadCompletedTestsSuccess = createAction(
  '[JournalEffect] Load Completed Tests Success',
  props<{ payload: SearchResultTestSchema[] }>(),
);

export const LoadCompletedTestsFailure = createAction(
  '[JournalEffect] Load Completed Tests Failure',
  props<{ error: MesError }>(),
);

export const UnsetError = createAction(
  '[JournalPage] Unset Error',
);

export const ClearChangedSlot = createAction(
  '[JournalPage] Clear Changed Slot',
  props<{ slotId: number }>(),
);

export const SelectPreviousDay = createAction(
  '[JournalPage] Select Previous Day',
);

export const SelectNextDay = createAction(
  '[JournalPage] Select Next Day',
);

export const SetSelectedDate = createAction(
  '[JournalEffects] Set Selected Day',
  props<{ payload: string }>(),
);

export const SetupPolling = createAction(
  '[JournalPage] Setup Journal Polling',
);

export const StopPolling = createAction(
  '[JournalPage] Stop Journal Polling',
);

export const JournalViewDidEnter = createAction(
  '[JournalPage] Journal view did enter',
);

export const JournalNavigateDay = createAction(
  '[JournalPage] Navigate Day',
  props<{ day: string }>(),
);

export const ResumingWriteUp = createAction(
  '[JournalPage] Resuming write-up',
  props<{ slotId: string }>(),
);

export const JournalRefreshError = createAction(
  '[JournalPage] Journal Refresh Error',
  props<{ errorDescription: string, errorMessage: string }>(),
);

export const JournalRefresh = createAction(
  '[JournalPage] Journal Refresh',
  props<{ mode: string }>(),
);

export const CandidateDetailsSeen = createAction(
  '[JournalPage] Candidate Details Seen',
  props<{ slotId: number }>(),
);
