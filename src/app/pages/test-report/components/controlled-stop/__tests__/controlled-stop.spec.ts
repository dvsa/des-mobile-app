import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { Store, StoreModule } from '@ngrx/store';
import { TestDataByCategoryProviderMock } from '@providers/test-data-by-category/__mocks__/test-data-by-category.mock';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import {
  ControlledStopAddDrivingFault,
  ControlledStopRemoveFault,
} from '@store/tests/test-data/common/controlled-stop/controlled-stop.actions';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { MockComponent } from 'ng-mocks';
import { testReportReducer } from '../../../test-report.reducer';
import { CompetencyButtonComponent } from '../../competency-button/competency-button';
import { ControlledStopComponent } from '../controlled-stop';

describe('ControlledStopComponent', () => {
  let fixture: ComponentFixture<ControlledStopComponent>;
  let component: ControlledStopComponent;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ControlledStopComponent,
        MockComponent(TickIndicatorComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
        MockComponent(CompetencyButtonComponent),
      ],
      providers: [
        {
          provide: TestDataByCategoryProvider,
          useClass: TestDataByCategoryProviderMock,
        },
      ],
      imports: [StoreModule.forRoot({ tests: testsReducer, testReport: testReportReducer })],
    });

    fixture = TestBed.createComponent(ControlledStopComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.B));
  });

  describe('Class', () => {
    describe('ControlledStopAddDrivingFault', () => {
      it('should dispatch an CONTROLLED_STOP_ADD_DRIVING_FAULT action for press', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(ControlledStopAddDrivingFault());
      });
      it('should not dispatch an CONTROLLED_STOP_ADD_DRIVING_FAULT action for tap', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ControlledStopAddDrivingFault());
      });
      it('should not dispatch an CONTROLLED_STOP_ADD_DRIVING_FAULT action if there is already a driving fault', () => {
        component.controlledStopOutcome = CompetencyOutcome.DF;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if there is a serious fault', () => {
        component.controlledStopOutcome = CompetencyOutcome.S;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if serious mode is active', () => {
        component.isSeriousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if there is a dangerous fault', () => {
        component.controlledStopOutcome = CompetencyOutcome.D;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ControlledStopAddDrivingFault());
      });
      it('should not dispatch an ADD_MANOEUVRE_DRIVING_FAULT action if dangerous mode is active', () => {
        component.isDangerousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ControlledStopAddDrivingFault());
      });
    });

    describe('removeManoeuvreDrivingFault', () => {
      it('should dispatch a REMOVE_MANOEUVRE_FAULT action for press', () => {
        component.isRemoveFaultMode = true;
        component.controlledStopOutcome = CompetencyOutcome.DF;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(ControlledStopRemoveFault(CompetencyOutcome.DF));
      });
      it('should dispatch a REMOVE_MANOEUVRE_FAULT action for tap', () => {
        component.isRemoveFaultMode = true;
        component.controlledStopOutcome = CompetencyOutcome.DF;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(ControlledStopRemoveFault(CompetencyOutcome.DF));
      });
      it('should not dispatch a REMOVE_MANOEUVRE_FAULT action if in the wrong mode', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.controlledStopOutcome = CompetencyOutcome.D;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(ControlledStopRemoveFault(CompetencyOutcome.D));
      });

      it('should dispatch a REMOVE_MANOEUVRE_FAULT action if there is a serious fault', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.controlledStopOutcome = CompetencyOutcome.S;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(ControlledStopRemoveFault(CompetencyOutcome.S));
      });
      it('should dispatch a REMOVE_MANOEUVRE_FAULT action if there is a dangerous fault', () => {
        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;
        component.controlledStopOutcome = CompetencyOutcome.D;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(ControlledStopRemoveFault(CompetencyOutcome.D));
      });
    });
  });
});
