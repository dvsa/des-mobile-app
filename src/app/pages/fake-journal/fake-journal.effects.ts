import { Injectable } from '@angular/core';
import { Application, Booking } from '@dvsa/mes-journal-schema';
import { CategoryCode, ConductedLanguage, Examiner, TestSlotAttributes } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { PopulateConductedLanguage } from '@store/tests/communication-preferences/communication-preferences.actions';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { PopulateApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.actions';
import { createPopulateCandidateDetailsAction } from '@store/tests/journal-data/common/candidate/candidate.action-creator';
import { PopulateExaminer } from '@store/tests/journal-data/common/examiner/examiner.actions';
import { PopulateTestCentre } from '@store/tests/journal-data/common/test-centre/test-centre.actions';
import { PopulateTestSlotAttributes } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.actions';
import { extractTestSlotAttributes } from '@store/tests/journal-data/common/test-slot-attributes/test-slot-attributes.selector';
import {
  InitialiseVehicleChecks as InitialiseVehicleChecksCatC,
  SetFullLicenceHeld as SetFullLicenceHeldCatC,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import {
  InitializeVehicleChecks as InitializeVehicleChecksCatD,
  SetFullLicenceHeld as SetFullLicenceHeldCatD,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
import * as testStatusActions from '@store/tests/test-status/test-status.actions';
import { IndependentDrivingTypeChanged, RouteNumberChanged } from '@store/tests/test-summary/test-summary.actions';
import { createPopulateVehicleDimensionsAction } from '@store/tests/vehicle-details/vehicle-details.action.creator';
import { GearboxCategoryChanged } from '@store/tests/vehicle-details/vehicle-details.actions';
import { switchMap } from 'rxjs/operators';
import { fakeJournalTestSlots } from './__mocks__/fake-journal.mock';
import { StartE2EPracticeTest } from './fake-journal.actions';

@Injectable()
export class FakeJournalEffects {
  constructor(private actions$: Actions) {}

  startE2EPracticeTestEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StartE2EPracticeTest),
      switchMap(({ slotId, category }) => {
        const slot = fakeJournalTestSlots.find((s) => s.slotDetail.slotId.toString() === slotId);
        const examiner: Examiner = {
          staffNumber: '01234567',
        };
        const testSlotAttributes: TestSlotAttributes = extractTestSlotAttributes(slot as unknown);
        const conductedLanguage: ConductedLanguage = testSlotAttributes.welshTest ? Language.CYMRAEG : Language.ENGLISH;

        const arrayOfActions: Action[] = [
          PopulateExaminer(examiner),
          PopulateTestCategory(slot?.booking?.application?.testCategory as CategoryCode),
          PopulateApplicationReference(slot?.booking?.application as Application),
          createPopulateCandidateDetailsAction(category, slot?.booking as Booking),
          PopulateTestSlotAttributes(testSlotAttributes),
          PopulateTestCentre({ centreId: slot?.testCentre?.centreId, costCode: slot?.testCentre?.costCode }),
          testStatusActions.SetTestStatusBooked(slotId.toString()),
          PopulateConductedLanguage(conductedLanguage),
        ];

        if (category !== TestCategory.B && category !== TestCategory.ADI2) {
          arrayOfActions.push(
            createPopulateVehicleDimensionsAction(category, slot?.booking?.application as Application)
          );
        }
        if (
          category === TestCategory.C ||
          category === TestCategory.C1 ||
          category === TestCategory.C1E ||
          category === TestCategory.CE
        ) {
          arrayOfActions.push(InitialiseVehicleChecksCatC(category));
        }
        if (
          category === TestCategory.D ||
          category === TestCategory.D1 ||
          category === TestCategory.D1E ||
          category === TestCategory.DE
        ) {
          arrayOfActions.push(InitializeVehicleChecksCatD(category));
        }
        if (category === TestCategory.C || category === TestCategory.C1) {
          arrayOfActions.push(SetFullLicenceHeldCatC(false));
        }
        if (category === TestCategory.D || category === TestCategory.D1) {
          arrayOfActions.push(SetFullLicenceHeldCatD(false));
        }
        if (
          category === TestCategory.F ||
          category === TestCategory.G ||
          category === TestCategory.H ||
          category === TestCategory.K
        ) {
          arrayOfActions.push(GearboxCategoryChanged('Manual'));
          arrayOfActions.push(RouteNumberChanged(88));
          arrayOfActions.push(IndependentDrivingTypeChanged('N/A'));
        }

        return arrayOfActions;
      })
    )
  );
}
