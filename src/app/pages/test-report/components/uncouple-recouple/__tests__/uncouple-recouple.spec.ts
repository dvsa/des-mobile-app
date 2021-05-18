import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '../../../../../shared/models/store.model';
import { IonicModule } from 'ionic-angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TickIndicatorComponent } from '../../../../../components/common/tick-indicator/tick-indicator';
import {
  DrivingFaultsBadgeComponent,
} from '../../../../../components/common/driving-faults-badge/driving-faults-badge';
import { testsReducer } from '../../../../../modules/tests/tests.reducer';
import {
  DangerousFaultBadgeComponent,
} from '../../../../../components/common/dangerous-fault-badge/dangerous-fault-badge';
import { CompetencyButtonComponent } from '../../../components/competency-button/competency-button';
import { testReportReducer } from '../../../test-report.reducer';
import { MockComponent } from 'ng-mocks';
import {
  SeriousFaultBadgeComponent,
} from '../../../../../components/common/serious-fault-badge/serious-fault-badge';
import { StartTest } from '../../../../../modules/tests/tests.actions';
import { UncoupleRecoupleComponent } from '../uncouple-recouple';
import { CompetencyOutcome } from '../../../../../shared/models/competency-outcome';
import {
  UncoupleRecoupleAddDrivingFault,
  UncoupleRecoupleRemoveFault,
} from '../../../../../modules/tests/test-data/common/uncouple-recouple/uncouple-recouple.actions';
import { ToggleSeriousFaultMode } from '../../../test-report.actions';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { TestDataByCategoryProvider } from '../../../../../providers/test-data-by-category/test-data-by-category';

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

  beforeEach(async(() => {
    fixture = TestBed.createComponent(UncoupleRecoupleComponent);
    component = fixture.componentInstance;
    store$ = TestBed.get(Store);
    store$.dispatch(new StartTest(105, TestCategory.BE));
  }));

  describe('Class', () => {

    describe('Add Driving Fault', () => {

      it('should dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action for press', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new UncoupleRecoupleAddDrivingFault());
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action for tap', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new UncoupleRecoupleAddDrivingFault());
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if there is already a driving fault',
        () => {
          component.uncoupleRecoupleOutcome = CompetencyOutcome.DF;
          const storeDispatchSpy = spyOn(store$, 'dispatch');
          component.addOrRemoveFault(true);
          expect(storeDispatchSpy).not.toHaveBeenCalledWith(
            new UncoupleRecoupleAddDrivingFault());
        });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if there is a serious fault', () => {
        component.uncoupleRecoupleOutcome = CompetencyOutcome.S;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new UncoupleRecoupleAddDrivingFault());
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if serious mode is active', () => {
        component.isSeriousMode = true;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new UncoupleRecoupleAddDrivingFault());
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if there is a dangerous fault', () => {
        component.uncoupleRecoupleOutcome = CompetencyOutcome.D;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new UncoupleRecoupleAddDrivingFault());
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_ADD_DRIVING_FAULT action if dangerous mode is active', () => {
        component.isDangerousMode = true;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new UncoupleRecoupleAddDrivingFault());
      });
    });

    describe('Remove Driving Fault', () => {

      it('should dispatch an UNCOUPLE_RECOUPLE_REMOVE_FAULT action for press', () => {
        component.isRemoveFaultMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.DF;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new UncoupleRecoupleRemoveFault());
      });

      it('should dispatch an UNCOUPLE_RECOUPLE_REMOVE_FAULT action for tap', () => {
        component.isRemoveFaultMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.DF;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new UncoupleRecoupleRemoveFault());
      });

      it('should not dispatch an UNCOUPLE_RECOUPLE_REMOVE_FAULT action if in the wrong mode', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.D;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).not.toHaveBeenCalledWith(
          new UncoupleRecoupleRemoveFault());
      });

      it('should dispatch a UNCOUPLE_RECOUPLE_REMOVE_FAULT action if there is a serious fault', () => {
        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.S;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new UncoupleRecoupleRemoveFault());
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new ToggleSeriousFaultMode());
      });

      it('should dispatch a UNCOUPLE_RECOUPLE_REMOVE_FAULT action if there is a dangerous fault', () => {
        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;
        component.uncoupleRecoupleOutcome = CompetencyOutcome.D;
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();
        expect(storeDispatchSpy).toHaveBeenCalledWith(
          new UncoupleRecoupleRemoveFault());
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
