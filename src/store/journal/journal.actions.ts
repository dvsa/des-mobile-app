import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { createAction, props } from '@ngrx/store';
import { ConnectionStatus } from '@providers/network-state/network-state';
import { MesError } from '@shared/models/mes-error.model';
import { JournalRehydrationPage, JournalRehydrationType } from '@store/journal/journal.effects';
import { ExaminerSlotItemsByDate } from './journal.model';

export const EarlyStartModalDidEnter = createAction('[JournalPage] Early Start Modal Entered');

export const EarlyStartDidContinue = createAction('[JournalPage] Early Start Modal Exited - Continue to Test');

export const EarlyStartDidReturn = createAction('[JournalPage] Early Start Modal Exited - Return to Journal');

export const LoadJournal = createAction('[JournalPage] Load Journal');

export const LoadJournalSilent = createAction('[JournalPage] Load Journal Silent');

export const LoadJournalSuccess = createAction(
	'[JournalPage] Load Journal Success',
	(
		payload: ExaminerSlotItemsByDate,
		onlineOffline: ConnectionStatus,
		unAuthenticatedMode: boolean,
		lastRefreshed: Date
	) => ({
		payload,
		onlineOffline,
		unAuthenticatedMode,
		lastRefreshed,
	})
);

export const LoadJournalFailure = createAction('[JournalEffects] Load Journal Failure', (error: MesError) => ({
	error,
}));

export const LoadJournalSilentFailure = createAction(
	'[JournalEffects] Load Journal Silent Failure',
	(error: MesError) => ({ error })
);

export const UnloadJournal = createAction('[JournalPage] Unload Journal');

export const LoadCompletedTests = createAction('[JournalEffect] Load Completed Tests', (callThrough = false) => ({
	callThrough,
}));

export const LoadCompletedTestsSuccess = createAction(
	'[JournalEffect] Load Completed Tests Success',
	(completedTests: SearchResultTestSchema[]) => ({ completedTests })
);

export const LoadCompletedTestsFailure = createAction(
	'[JournalEffect] Load Completed Tests Failure',
	(error: MesError) => ({ error })
);

export const UnsetError = createAction('[JournalPage] Unset Error');

export const ClearChangedSlot = createAction('[JournalPage] Clear Changed Slot', (slotId: number) => ({ slotId }));

export const SelectPreviousDay = createAction('[JournalPage] Select Previous Day');

export const SelectNextDay = createAction('[JournalPage] Select Next Day');

export const SetSelectedDate = createAction('[JournalEffects] Set Selected Day', (selectedDate: string) => ({
	selectedDate,
}));

export const SetupPolling = createAction('[JournalPage] Setup Journal Polling');

export const StopPolling = createAction('[JournalPage] Stop Journal Polling');

export const JournalViewDidEnter = createAction('[JournalPage] Journal view did enter');

export const JournalNavigateDay = createAction('[JournalPage] Navigate Day', (day: string) => ({ day }));

export const ResumingWriteUp = createAction('[JournalPage] Resuming write-up', (slotId: string) => ({ slotId }));

export const JournalRefreshError = createAction(
	'[JournalPage] Journal Refresh Error',
	(errorDescription: string, errorMessage: string) => ({ errorDescription, errorMessage })
);

export const JournalRefresh = createAction('[JournalPage] Journal Refresh', (mode: string) => ({ mode }));

export const JournalRehydration = createAction(
	'[JournalPage] Journal Rehydration',
	(refreshType: JournalRehydrationType, page: JournalRehydrationPage) => ({ refreshType, page })
);

export const JournalRehydrationSuccess = createAction(
	'[JournalEffect] Journal Rehydration Success',
	(refreshType: JournalRehydrationType, page: JournalRehydrationPage) => ({ refreshType, page })
);
export const JournalRehydrationNull = createAction(
	'[JournalEffect] Journal Rehydration List of rehydratable tests is empty',
	(refreshType: JournalRehydrationType, page: JournalRehydrationPage) => ({ refreshType, page })
);
export const JournalRehydrationError = createAction(
	'[JournalEffect] Journal Rehydration Error',
	(refreshType: JournalRehydrationType, page: JournalRehydrationPage) => ({ refreshType, page })
);

export const CandidateDetailsSeen = createAction('[JournalPage] Candidate Details Seen', props<{ slotId: number }>());
