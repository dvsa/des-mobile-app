import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { IonicModule } from '@ionic/angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of, Subscription } from 'rxjs';
import { testsReducer } from '@store/tests/tests.reducer';
import { StartTest } from '@store/tests/tests.actions';
import { AddDrivingFault } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { DrivingFaultSummaryComponent } from '../driving-fault-summary';

describe('DrivingFaultSummary', () => {
  enum driverType {
    R = 'R',
    D = 'D',
  }

  let fixture: ComponentFixture<DrivingFaultSummaryComponent>;
  let component: DrivingFaultSummaryComponent;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrivingFaultSummaryComponent,
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer }),
      ],
      providers: [
        FaultCountProvider,
      ],
    });

    fixture = TestBed.createComponent(DrivingFaultSummaryComponent);
    component = fixture.componentInstance;
    component.subscription = new Subscription();
    store$ = TestBed.inject(Store);
  }));

  describe('DOM', () => {
    let componentEl: DebugElement;

    beforeEach(() => {
      componentEl = fixture.debugElement;

      store$.dispatch(StartTest(103, TestCategory.B));
      store$.dispatch(PopulateTestCategory(TestCategory.B));
    });

    it('should display 0 driving faults for a new test', () => {
      fixture.detectChanges();
      const summaryCount: HTMLElement = componentEl.query(By.css('#summary-count')).nativeElement;
      expect(summaryCount.textContent).toBe('0');
    });

    it('should display 3 driving faults when 3 driving faults have been marked', () => {
      store$.dispatch(AddDrivingFault({ competency: Competencies.clearance, newFaultCount: 1 }));
      store$.dispatch(AddDrivingFault({ competency: Competencies.controlsSteering, newFaultCount: 1 }));
      store$.dispatch(AddDrivingFault({ competency: Competencies.moveOffControl, newFaultCount: 1 }));

      fixture.detectChanges();

      const summaryCount: HTMLElement = componentEl.query(By.css('#summary-count')).nativeElement;
      expect(summaryCount.textContent).toBe('3');
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ionViewWillEnter', () => {
    it('should setup subscription', () => {
      component.componentState = { count$: of(1), driverRiderFlag$: of(driverType.R) };
      component.ionViewWillEnter();

      expect(component.subscription).toBeDefined();
    });
  });

  describe('driverTypeSwitch', () => {
    it('should return R when a category equals EUAM1,', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.EUAM1);
      expect(driverTypeTest).toEqual('R');
    });

    it('should return R when a category equals EUAM2', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.EUAM2);
      expect(driverTypeTest).toEqual('R');
    });

    it('should return D when a category equals B', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.B);
      expect(driverTypeTest).toEqual('D');
    });

    it('should return D when a category equals B+E', () => {
      const driverTypeTest = component.driverTypeSwitch(TestCategory.BE);
      expect(driverTypeTest).toEqual('D');
    });
  });
});
