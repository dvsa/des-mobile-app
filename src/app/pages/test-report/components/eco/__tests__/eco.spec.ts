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
import { Subscription } from 'rxjs';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestsModel } from '@store/tests/tests.model';
import { provideMockStore } from '@ngrx/store/testing';
import { CompetencyButtonComponent } from '../../competency-button/competency-button';
import { testReportReducer } from '../../../test-report.reducer';
import { EcoComponent } from '../eco';

describe('EcoComponent', () => {
  let fixture: ComponentFixture<EcoComponent>;
  let component: EcoComponent;
  let store$: Store<StoreModel>;
  let storeDispatchSpy: jasmine.Spy;

  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          version: '1',
          rekey: false,
          activityCode: '1',
          passCompletion: { passCertificateNumber: 'test', code78Present: true },
          category: TestCategory.SC,
          changeMarker: null,
          examinerBooked: null,
          examinerConducted: null,
          examinerKeyed: null,
          journalData: {
            examiner: null,
            testCentre: null,
            testSlotAttributes: null,
            applicationReference: null,
            candidate: {
              candidateName: {
                firstName: 'Firstname',
                lastName: 'Lastname',
              },
            },
          },
          testData: {
            eco: {
              completed: true,
              adviceGivenControl: true,
              adviceGivenPlanning: true,
            },
          },
        } as TestResultCommonSchema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
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
      providers: [provideMockStore({ initialState })],
    });

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

    describe('ngOnDestroy', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ngOnDestroy();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });

    describe('ngOnInit', () => {
      it('should resolve state variables', () => {
        component.ngOnInit();
        component.componentState.completed$
          .subscribe((res) => expect(res).toEqual(true));
        component.componentState.adviceGivenPlanning$
          .subscribe((res) => expect(res).toEqual(true));
        component.componentState.adviceGivenControl$
          .subscribe((res) => expect(res).toEqual(true));
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
