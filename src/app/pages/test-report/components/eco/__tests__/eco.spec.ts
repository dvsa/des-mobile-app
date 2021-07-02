import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { StoreModule, Store } from '@ngrx/store';
import { testsReducer } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { StartTest } from '@store/tests/tests.actions';
import {
  ToggleEco,
  TogglePlanningEco,
  ToggleControlEco,
}
  from '@store/tests/test-data/common/eco/eco.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { CompetencyButtonComponent } from '../../competency-button/competency-button';
import { testReportReducer } from '../../../test-report.reducer';
import { EcoComponent } from '../eco';

describe('Eco component', () => {
  let fixture: ComponentFixture<EcoComponent>;
  let component: EcoComponent;
  let store$: Store<StoreModel>;
  let storeDispatchSpy: jasmine.Spy;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        EcoComponent,
        MockComponent(TickIndicatorComponent),
        MockComponent(CompetencyButtonComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer, testReport: testReportReducer }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(EcoComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.B));
    storeDispatchSpy = spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('Record that Eco has been assessed', () => {
      it('should dispatch a TOGGLE_ECO action', () => {
        component.toggleEco();
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          ToggleEco(),
        );
      });
      it('should not dispatch a TOGGLE_ECO action when advice has been given', () => {
        component.adviceGivenControl = true;
        component.toggleEco();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          ToggleEco(),
        );
      });
    });

    describe('Record that Eco Control advice was given', () => {
      it('should dispatch a TOGGLE_CONTROL_ECO action', () => {
        component.toggleEcoControl();
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          ToggleControlEco(),
        );
      });
    });

    describe('Record that Eco Planning advice was given', () => {
      it('should dispatch a TOGGLE_PLANNING_ECO action', () => {
        component.toggleEcoPlanning();
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          TogglePlanningEco(),
        );
      });
    });
  });

});
