import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { DrivingFaultSummaryComponent } from '../driving-fault-summary';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { IonicModule, Config } from '@ionic/angular';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ConfigMock } from 'ionic-mocks';
import { Subscription } from 'rxjs';
import { testsReducer } from '@store/tests/tests.reducer';
import { StartTest } from '@store/tests/tests.actions';
import { AddDrivingFault } from '@store/tests/test-data/common/driving-faults/driving-faults.actions';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { PopulateTestCategory } from '@store/tests/category/category.actions';
import { configureTestSuite } from 'ng-bullet';

describe('DrivingFaultSummary', () => {
  let fixture: ComponentFixture<DrivingFaultSummaryComponent>;
  let component: DrivingFaultSummaryComponent;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrivingFaultSummaryComponent,
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer }),
      ],
      providers: [
        { provide: Config, useFactory: () => ConfigMock.instance() },
        FaultCountProvider,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DrivingFaultSummaryComponent);
    component = fixture.componentInstance;
    component.subscription = new Subscription();
    store$ = TestBed.get(Store);
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

  describe('driverTypeSwitch()', () => {
    it('should return R when a category equals EUAM1,', () => {
      const driverType = component.driverTypeSwitch(TestCategory.EUAM1);
      expect(driverType).toEqual('R');
    });

    it('should return R when a category equals EUAM2', () => {
      const driverType = component.driverTypeSwitch(TestCategory.EUAM2);
      expect(driverType).toEqual('R');
    });

    it('should return D when a category equals B', () => {
      const driverType = component.driverTypeSwitch(TestCategory.B);
      expect(driverType).toEqual('D');
    });

    it('should return D when a category equals B+E', () => {
      const driverType = component.driverTypeSwitch(TestCategory.BE);
      expect(driverType).toEqual('D');
    });
  });
});
