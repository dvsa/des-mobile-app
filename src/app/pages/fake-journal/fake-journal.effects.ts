import { Injectable } from '@angular/core';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import {
  PopulateApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { PopulateCandidateDetails } from '@store/tests/journal-data/common/candidate/candidate.actions';
import {
  PopulateTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import { PopulateTestCentre } from '@store/tests/journal-data/common/test-centre/test-centre.actions';
import { Application } from '@dvsa/mes-journal-schema';
import {
  extractTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { Examiner, CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { PopulateExaminer } from '@store/tests/journal-data/common/examiner/examiner.actions';
import { fakeJournalTestSlots } from './__mocks__/fake-journal.mock';
import * as fakeJournalActions from './fake-journal.actions';

@Injectable()
export class FakeJournalEffects {
  constructor(
    private actions$: Actions,
  ) { }

  startE2EPracticeTestEffect$ = createEffect(() => this.actions$.pipe(
    ofType(fakeJournalActions.StartE2EPracticeTest),
    switchMap((action) => {
      const startTestAction = action as ReturnType<typeof fakeJournalActions.StartE2EPracticeTest>;
      const slot = fakeJournalTestSlots.find((s) => s.slotDetail.slotId === startTestAction.slotId);

      const examiner: Examiner = {
        staffNumber: '01234567',
      };

      return [
        PopulateExaminer(examiner),
        PopulateTestCategory(slot.booking.application.testCategory as CategoryCode),
        PopulateApplicationReference(slot.booking.application as Application),
        PopulateCandidateDetails(slot.booking.candidate),
        PopulateTestSlotAttributes(extractTestSlotAttributes(slot as unknown)),
        PopulateTestCentre({ centreId: slot.testCentre.centreId, costCode: slot.testCentre.costCode }),
        testStatusActions.SetTestStatusBooked(slot.slotDetail.slotId),
      ];
    }),
  ));

}
