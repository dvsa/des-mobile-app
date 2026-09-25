import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { Store, StoreModule } from '@ngrx/store';
import { TestDataByCategoryProviderMock } from '@providers/test-data-by-category/__mocks__/test-data-by-category.mock';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { StoreModel } from '@shared/models/store.model';
import { getTestData as getTestDataCatF } from '@store/tests/test-data/cat-home/test-data.cat-f.reducer';
import {
  HighwayCodeSafetyAddDrivingFault,
  HighwayCodeSafetyRemoveFault,
} from '@store/tests/test-data/common/highway-code-safety/highway-code-safety.actions';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { MockComponent } from 'ng-mocks';
import { testReportReducer } from '../../../test-report.reducer';
import { CompetencyButtonComponent } from '../../competency-button/competency-button';
import { HighwayCodeSafetyComponent } from '../highway-code-safety';

describe('HighwayCodeSafetyComponent', () => {
  let fixture: ComponentFixture<HighwayCodeSafetyComponent>;
  let component: HighwayCodeSafetyComponent;
  let store$: Store<StoreModel>;
  let testDataByCategoryProvider: TestDataByCategoryProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        HighwayCodeSafetyComponent,
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

    fixture = TestBed.createComponent(HighwayCodeSafetyComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.F));
    testDataByCategoryProvider = TestBed.inject(TestDataByCategoryProvider);
    spyOn(testDataByCategoryProvider, 'getTestDataByCategoryCode').and.returnValue(getTestDataCatF);
  });

  describe('Class', () => {
    describe('HighwayCodeSafetyAddDrivingFault', () => {
      it('should dispatch an HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT action for press', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(HighwayCodeSafetyAddDrivingFault());
      });
      it('should not dispatch an HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT action for tap', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(HighwayCodeSafetyAddDrivingFault());
      });
      it('should not dispatch an HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT action if already a driving fault', () => {
        component.highwayCodeSafetyDrivingFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(HighwayCodeSafetyAddDrivingFault());
      });
      it('should not dispatch an HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT action if there is a serious fault', () => {
        component.highwayCodeSafetySeriousFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(HighwayCodeSafetyAddDrivingFault());
      });
      it('should not dispatch an HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT action if serious mode is active', () => {
        component.isSeriousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(HighwayCodeSafetyAddDrivingFault());
      });
      it('should not dispatch an HIGHWAY_CODE_SAFETY_ADD_DRIVING_FAULT action if dangerous mode is active', () => {
        component.isDangerousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(HighwayCodeSafetyAddDrivingFault());
      });
    });

    describe('removeHighwayCodeSafetyDrivingFault', () => {
      it('should dispatch a HIGHWAY_CODE_SAFETY_REMOVE_FAULT action for press', () => {
        component.isRemoveFaultMode = true;
        component.highwayCodeSafetyDrivingFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(HighwayCodeSafetyRemoveFault());
      });
      it('should dispatch a HIGHWAY_CODE_SAFETY_REMOVE_FAULT action for tap', () => {
        component.isRemoveFaultMode = true;
        component.highwayCodeSafetyDrivingFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(HighwayCodeSafetyRemoveFault());
      });
      it('should not dispatch a HIGHWAY_CODE_SAFETY_REMOVE_FAULT action if in the wrong mode', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.highwayCodeSafetyDrivingFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).not.toHaveBeenCalledWith(HighwayCodeSafetyRemoveFault());
      });

      it('should dispatch a HIGHWAY_CODE_SAFETY_REMOVE_FAULT action if there is a serious fault', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.highwayCodeSafetySeriousFault = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(HighwayCodeSafetyRemoveFault());
      });
    });
  });
});
