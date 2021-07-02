import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { IonicModule } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import {
  DrivingFaultsBadgeComponent,
} from '@components/common/driving-faults-badge/driving-faults-badge';
import { testsReducer } from '@store/tests/tests.reducer';
import {
  DangerousFaultBadgeComponent,
} from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { CompetencyButtonComponent } from '@pages/test-report/components/competency-button/competency-button';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { MockComponent } from 'ng-mocks';
import {
  SeriousFaultBadgeComponent,
} from '@components/common/serious-fault-badge/serious-fault-badge';
import { StartTest } from '@store/tests/tests.actions';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import {
  UncoupleRecoupleAddDrivingFault,
  UncoupleRecoupleRemoveFault,
} from '@store/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import { ToggleSeriousFaultMode } from '../../../test-report.actions';
import { UncoupleRecoupleComponent } from '../uncouple-recouple';

describe('UncoupleRecoupleComponent', () => {
  let fixture: ComponentFixture<UncoupleRecoupleComponent>;
  let component: UncoupleRecoupleComponent;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        UncoupleRecoupleComponent,
        MockComponent(TickIndicatorComponent),
        MockComponent(DrivingFaultsBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DangerousFaultBadgeComponent),
        MockComponent(CompetencyButtonComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer, testReport: testReportReducer }),
      ],
      providers: [
        TestDataByCategoryProvider,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(UncoupleRecoupleComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(105, TestCategory.BE));
  }));

  describe('Class', () => {

    describe('Add Driving Fault', () => {

      it('should dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action for press', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          UncoupleRecoupleAddDrivingFault(),
        );
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action for tap', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          UncoupleRecoupleAddDrivingFault(),
        );
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if there is already a driving fault',
        () => {
          component.uncoupleRecoupleOutcome = CompetencyOutcome.DF;
          const storeDispatchSpy = spyOn(store$, 'dispatch');
          component.addOrRemoveFault(true);
          expect(storeDispatchSpy).not.toHaveBeenCalledWith(
            UncoupleRecoupleAddDrivingFault(),
          );
        });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if there is a serious fault', () => {
        component.uncoupleRecoupleOutcome = CompetencyOutcome.S;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          UncoupleRecoupleAddDrivingFault(),
        );
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if serious mode is active', () => {
        component.isSeriousMode = true;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          UncoupleRecoupleAddDrivingFault(),
        );
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if there is a dangerous fault', () => {
        component.uncoupleRecoupleOutcome = CompetencyOutcome.D;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          UncoupleRecoupleAddDrivingFault(),
        );
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if dangerous mode is active', () => {
        component.isDangerousMode = true;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          UncoupleRecoupleAddDrivingFault(),
        );
      });
    });

    describe('Remove Driving Fault', () => {

      it('should dispatch an UNCOUPLE_RECOUPLE_REMOVE_FAULT action for press', () => {
        component.isRemoveFaultMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.DF;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          UncoupleRecoupleRemoveFault(),
        );
      });

      it('should dispatch an UNCOUPLE_RECOUPLE_REMOVE_FAULT action for tap', () => {
        component.isRemoveFaultMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.DF;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          UncoupleRecoupleRemoveFault(),
        );
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_REMOVE_FAULT action if in the wrong mode', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.D;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          UncoupleRecoupleRemoveFault(),
        );
      });

      it('should dispatch a UNCOUPLE_RECOUPLE_REMOVE_FAULT action if there is a serious fault', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.S;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          UncoupleRecoupleRemoveFault(),
        );
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          ToggleSeriousFaultMode(),
        );
      });

      it('should dispatch a UNCOUPLE_RECOUPLE_REMOVE_FAULT action if there is a dangerous fault', () => {
        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.D;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          UncoupleRecoupleRemoveFault(),
        );
      });
    });
  });

  describe('DOM', () => {

    it('should pass the number of driving faults to the driving faults badge component', () => {
      component.category = TestCategory.C1E;
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;
      component.uncoupleRecoupleOutcome = CompetencyOutcome.DF;
      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);
    });

    it('should pass a ripple value of false to the competency button component', () => {
      component.category = TestCategory.C1E;
      fixture.detectChanges();
      component.isRemoveFaultMode = true;
      component.isSeriousMode = true;
      const competencyButton = fixture.debugElement.query(By.css('competency-button.uncouple-recouple-competency'))
        .componentInstance as CompetencyButtonComponent;
      fixture.detectChanges();
      expect(competencyButton.ripple).toEqual(false);
    });

    describe('Tick button effects', () => {

      it('should have added no classes to the tick button', () => {
        component.category = TestCategory.BE;
        const tickButton = fixture.debugElement.query(By.css('competency-button.uncouple-recouple-tick'));
        fixture.detectChanges();
        expect(tickButton.nativeElement.className).toEqual('uncouple-recouple-tick');
      });

      it('should have added a checked class to the tick button', () => {
        component.category = TestCategory.BE;
        fixture.detectChanges();
        component.selectedUncoupleRecouple = true;
        const tickButton = fixture.debugElement.query(By.css('competency-button.uncouple-recouple-tick'));
        fixture.detectChanges();
        expect(tickButton.nativeElement.className).toEqual('uncouple-recouple-tick checked');
      });

    });
  });

});
