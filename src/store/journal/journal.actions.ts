// eslint-disable-next-line max-classes-per-file
import { Action } from '@ngrx/store';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { ConnectionStatus } from '../../app/providers/network-state/network-state';
import { ExaminerSlotItemsByDate } from './journal.model';
import { MesError } from '../../app/shared/models/mes-error.model';

export const LOAD_JOURNAL = '[JournalPage] Load Journal';
export const LOAD_JOURNAL_SUCCESS = '[JournalEffects] Load Journal Success';
export const LOAD_JOURNAL_FAILURE = '[JournalEffects] Load Journal Failure';

export const LOAD_JOURNAL_SILENT = '[JournalEffect] Load Journal Silent';
export const LOAD_JOURNAL_SILENT_FAILURE = '[JournalEffect] Load Journal Silent Failure';

export const LOAD_COMPLETED_TESTS = '[JournalEffect] Load Completed Tests';
export const LOAD_COMPLETED_TESTS_SUCCESS = '[JournalEffect] Load Completed Tests Success';
export const LOAD_COMPLETED_TESTS_FAILURE = '[JournalEffect] Load Completed Tests Failure';

export const SETUP_JOURNAL_POLLING = '[JournalPage] Setup Journal Polling';
export const STOP_JOURNAL_POLLING = '[JournalPage] Stop Journal Polling';
export const UNLOAD_JOURNAL = '[JournalPage] Unload Journal';
export const CLEAR_CHANGED_SLOT = '[JournalPage] Clear Changed Slot';
export const UNSET_ERROR = '[JournalPage] Unset Error';
export const SELECT_PREVIOUS_DAY = '[JournalPage] Select Previous Day';
export const SELECT_NEXT_DAY = '[JournalPage] Select Next Day';
export const SET_SELECTED_DAY = '[JournalEffects] Set Selected Day';
export const CANDIDATE_DETAILS_SEEN = '[JournalPage] Candidate Details Seen';

// Analytic actions

export const EARLY_START_MODAL_DID_ENTER = '[JournalPage] Early Start Modal Entered';
export const EARLY_START_MODAL_RETURN_TO_JOURNAL = '[JournalPage] Early Start Modal Exited - Return to Journal';
export const EARLY_START_MODAL_CONTINUE_TO_TEST = '[JournalPage] Early Start Modal Exited - Continue to Test';
export const JOURNAL_VIEW_DID_ENTER = '[JournalPage] Journal view did enter';
export const JOURNAL_NAVIGATE_DAY = '[JournalPage] Navigate Day';
export const JOURNAL_REFRESH = '[JournalPage] Journal Refresh';
export const JOURNAL_REFRESH_ERROR = '[JournalPage] Journal Refresh Error';
export const RESUMING_WRITE_UP = '[JournalPage] Resuming write-up';

export class EarlyStartModalDidEnter implements Action {
  readonly type = EARLY_START_MODAL_DID_ENTER;
}

export class EarlyStartDidContinue implements Action {
  readonly type = EARLY_START_MODAL_CONTINUE_TO_TEST;
}

export class EarlyStartDidReturn implements Action {
  readonly type = EARLY_START_MODAL_RETURN_TO_JOURNAL;
}

export class LoadJournal implements Action {
  readonly type = LOAD_JOURNAL;
}

export class LoadJournalSilent implements Action {
  readonly type = LOAD_JOURNAL_SILENT;
}

export class LoadJournalSuccess implements Action {
  readonly type = LOAD_JOURNAL_SUCCESS;

  // TODO: declare payload with the correct type when we have a slot type in place
  constructor(
    public payload: ExaminerSlotItemsByDate,
    public onlineOffline: ConnectionStatus,
    public unAuthenticatedMode: boolean,
    public lastRefreshed: Date,
  ) { }
}

export class LoadJournalFailure implements Action {
  readonly type = LOAD_JOURNAL_FAILURE;
  constructor(public payload: MesError) { }
}

export class LoadJournalSilentFailure implements Action {
  readonly type = LOAD_JOURNAL_SILENT_FAILURE;
  constructor(public payload: MesError) { }
}

export class UnloadJournal implements Action {
  readonly type = UNLOAD_JOURNAL;
}

export class LoadCompletedTests implements Action {
  readonly type = LOAD_COMPLETED_TESTS;
}

export class LoadCompletedTestsSuccess implements Action {
  readonly type = LOAD_COMPLETED_TESTS_SUCCESS;
  constructor(public payload: SearchResultTestSchema[]) { }
}

export class LoadCompletedTestsFailure implements Action {
  readonly type = LOAD_COMPLETED_TESTS_FAILURE;
  constructor(public payload: MesError) { }
}

export class UnsetError implements Action {
  readonly type = UNSET_ERROR;
}

export class ClearChangedSlot implements Action {
  readonly type = CLEAR_CHANGED_SLOT;
  constructor(public slotId: number) { }
}

export class SelectPreviousDay implements Action {
  readonly type = SELECT_PREVIOUS_DAY;
}

export class SelectNextDay implements Action {
  readonly type = SELECT_NEXT_DAY;
}

export class SetSelectedDate implements Action {
  readonly type = SET_SELECTED_DAY;
  constructor(public payload: string) { }
}

export class SetupPolling implements Action {
  readonly type = SETUP_JOURNAL_POLLING;
}

export class StopPolling implements Action {
  readonly type = STOP_JOURNAL_POLLING;
}

export class JournalViewDidEnter implements Action {
  readonly type = JOURNAL_VIEW_DID_ENTER;
}

export class JournalNavigateDay implements Action {
  readonly type = JOURNAL_NAVIGATE_DAY;
  constructor(public day: string) { }
}

export class ResumingWriteUp implements Action {
  readonly type = RESUMING_WRITE_UP;
  constructor(public slotId: string) { }
}

export class JournalRefreshError implements Action {
  readonly type = JOURNAL_REFRESH_ERROR;
  constructor(public errorDescription: string, public errorMessage: string) { }
}

export class JournalRefresh implements Action {
  readonly type = JOURNAL_REFRESH;
  constructor(public mode: string) { }
}

export class CandidateDetailsSeen implements Action {
  readonly type = CANDIDATE_DETAILS_SEEN;
  constructor(public slotId: number) { }
}

export type JournalActionTypes =
  | LoadJournal
  | LoadJournalSilent
  | LoadJournalSuccess
  | LoadJournalFailure
  | LoadCompletedTests
  | LoadCompletedTestsSuccess
  | LoadCompletedTestsFailure
  | UnloadJournal
  | UnsetError
  | ClearChangedSlot
  | SelectPreviousDay
  | SelectNextDay
  | SetSelectedDate
  | SetupPolling
  | StopPolling
  | JournalViewDidEnter
  | JournalNavigateDay
  | ResumingWriteUp
  | JournalRefreshError
  | JournalRefresh
  | CandidateDetailsSeen
  | EarlyStartModalDidEnter
  | EarlyStartDidContinue
  | EarlyStartDidReturn;
