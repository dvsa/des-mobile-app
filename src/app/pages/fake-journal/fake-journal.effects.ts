import { Injectable } from '@angular/core';
import {
  Actions, createEffect, ofType,
} from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import {
  PopulateApplicationReference,
} from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import {
  PopulateTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import { PopulateTestCentre } from '@store/tests/journal-data/common/test-centre/test-centre.actions';
import { Application, Booking } from '@dvsa/mes-journal-schema';
import {
  extractTestSlotAttributes,
} from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import {
  Examiner, CategoryCode, ConductedLanguage, TestSlotAttributes,
} from '@dvsa/mes-test-schema/categories/common';
import { PopulateExaminer } from '@store/tests/journal-data/common/examiner/examiner.actions';
import {
  createPopulateCandidateDetailsAction,
} from '@store/tests/journal-data/common/candidate/candidate.action-creator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  InitialiseVehicleChecks as InitialiseVehicleChecksCatC,
  SetFullLicenceHeld,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { Action } from '@ngrx/store';
import {
  GearboxCategoryChanged,
} from '@store/tests/vehicle-details/vehicle-details.actions';
import {
  InitializeVehicleChecks as InitializeVehicleChecksCatD,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
import { IndependentDrivingTypeChanged, RouteNumberChanged } from '@store/tests/test-summary/test-summary.actions';
import { createPopulateVehicleDimensionsAction } from '@store/tests/vehicle-details/vehicle-details.action.creator';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { PopulateConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.actions';
import * as fakeJournalActions from './fake-journal.actions';
import { fakeJournalTestSlots } from './__mocks__/fake-journal.mock';

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
      const testSlotAttributes: TestSlotAttributes = extractTestSlotAttributes(slot as unknown);
      const conductedLanguage: ConductedLanguage = testSlotAttributes.welshTest ? Language.CYMRAEG : Language.ENGLISH;

      const arrayOfActions: Action[] = [
        PopulateExaminer(examiner),
        PopulateTestCategory(slot.booking.application.testCategory as CategoryCode),
        PopulateApplicationReference(slot.booking.application as Application),
        createPopulateCandidateDetailsAction(action.category, slot.booking as Booking),
        PopulateTestSlotAttributes(testSlotAttributes),
        PopulateTestCentre({ centreId: slot.testCentre.centreId, costCode: slot.testCentre.costCode }),
        testStatusActions.SetTestStatusBooked(slot.slotDetail.slotId),
        PopulateConductedLanguage(conductedLanguage),
      ];

      if (startTestAction.category !== TestCategory.B && startTestAction.category !== TestCategory.ADI2) {
        arrayOfActions.push(
          createPopulateVehicleDimensionsAction(startTestAction.category, slot.booking.application as Application),
        );
      }
      if (
        startTestAction.category === TestCategory.C
        || startTestAction.category === TestCategory.C1
        || startTestAction.category === TestCategory.C1E
        || startTestAction.category === TestCategory.CE) {
        arrayOfActions.push(InitialiseVehicleChecksCatC(startTestAction.category));
      }
      if (
        startTestAction.category === TestCategory.D
        || startTestAction.category === TestCategory.D1
        || startTestAction.category === TestCategory.D1E
        || startTestAction.category === TestCategory.DE) {
        arrayOfActions.push(InitializeVehicleChecksCatD(startTestAction.category));
      }
      if (
        startTestAction.category === TestCategory.C
        || startTestAction.category === TestCategory.C1
        || startTestAction.category === TestCategory.D
        || startTestAction.category === TestCategory.D1
      ) {
        arrayOfActions.push(SetFullLicenceHeld(false));
      }
      if (
        startTestAction.category === TestCategory.F
        || startTestAction.category === TestCategory.G
        || startTestAction.category === TestCategory.H
        || startTestAction.category === TestCategory.K) {
        arrayOfActions.push(GearboxCategoryChanged('Manual'));
        arrayOfActions.push(RouteNumberChanged(88));
        arrayOfActions.push(IndependentDrivingTypeChanged('N/A'));
      }

      return arrayOfActions;
    }),
  ));

}
