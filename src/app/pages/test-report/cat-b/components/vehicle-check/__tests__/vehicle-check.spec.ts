import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { By } from '@angular/platform-browser';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule } from '@ionic/angular';
import {
  ShowMeQuestionDangerousFault,
  ShowMeQuestionDrivingFault,
  ShowMeQuestionPassed,
  ShowMeQuestionRemoveFault,
  ShowMeQuestionSeriousFault,
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { StartTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { CompetencyButtonComponent } from '@pages/test-report/components/competency-button/competency-button';
import { testReportReducer } from '@pages/test-report/test-report.reducer';
import { VehicleCheckComponent } from '../vehicle-check';

describe('VehicleCheckComponent', () => {

  let counter: number = 105;
  let fixture: ComponentFixture<VehicleCheckComponent>;
  let component: VehicleCheckComponent;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleCheckComponent,
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
    });

    fixture = TestBed.createComponent(VehicleCheckComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    store$.dispatch(StartTest(counter, TestCategory.B));
    counter += 1;
  }));

  describe('Class', () => {
    describe('addFault', () => {
      it('should dispatch SHOW_ME_QUESTION_SERIOUS_FAULT when serious mode is on', () => {
        fixture.detectChanges();
        component.isSeriousMode = true;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(false);

        expect(storeDisptachSpy).toHaveBeenCalledWith(ShowMeQuestionSeriousFault());
      });

      it('should dispatch SHOW_ME_QUESTION_DANGEROUS_FAULT when dangerous mode is on', () => {
        fixture.detectChanges();
        component.isDangerousMode = true;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(false);

        expect(storeDisptachSpy).toHaveBeenCalledWith(ShowMeQuestionDangerousFault());
      });

      it('should dispatch SHOW_ME_QUESTION_DRIVING_FAULT when competency is pressed', () => {
        fixture.detectChanges();

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(true);

        expect(storeDisptachSpy).toHaveBeenCalledWith(ShowMeQuestionDrivingFault());
      });

      it('should not dispatch SHOW_ME_QUESTION_DRIVING_FAULT when competency was just tapped', () => {
        fixture.detectChanges();

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.addFault(false);

        expect(storeDisptachSpy).not.toHaveBeenCalledWith(ShowMeQuestionDrivingFault());
      });
    });

    describe('removeFault', () => {
      it('should dispatch a SHOW_ME_QUESTION_PASSED action on remove fault', () => {
        store$.dispatch(ShowMeQuestionDrivingFault());
        fixture.detectChanges();

        component.isRemoveFaultMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.removeFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(ShowMeQuestionPassed());

      });

      it('should dispatch a SHOW_ME_QUESTION_PASSED action if there is a serious fault', () => {
        store$.dispatch(ShowMeQuestionSeriousFault());
        fixture.detectChanges();

        component.isRemoveFaultMode = true;
        component.isSeriousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault(true);

        expect(storeDispatchSpy).toHaveBeenCalledWith(ShowMeQuestionPassed());
      });

      it('should dispatch a SHOW_ME_QUESTION_PASSED action if there is a dangerous fault', () => {
        store$.dispatch(ShowMeQuestionDangerousFault());
        fixture.detectChanges();

        component.isRemoveFaultMode = true;
        component.isDangerousMode = true;

        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.addOrRemoveFault();

        expect(storeDispatchSpy).toHaveBeenCalledWith(ShowMeQuestionPassed());
      });
    });

    describe('toggleShowMeQuestion', () => {
      it('should dispatch SHOW_ME_QUESTION_PASSED when competency has not got any faults', () => {
        fixture.detectChanges();
        component.showMeQuestionFault = null;
        component.tellMeQuestionFault = null;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.toggleShowMeQuestion();

        expect(storeDisptachSpy).toHaveBeenCalledWith(ShowMeQuestionPassed());
      });

      it('should not dispatch anything when show me has driving fault', () => {
        fixture.detectChanges();
        component.showMeQuestionFault = CompetencyOutcome.DF;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.toggleShowMeQuestion();

        expect(storeDisptachSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch anything when show me has serious fault', () => {
        fixture.detectChanges();
        component.showMeQuestionFault = CompetencyOutcome.S;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.toggleShowMeQuestion();

        expect(storeDisptachSpy).not.toHaveBeenCalled();
      });

      it('should not dispatch anything when show me has dangerous fault', () => {
        fixture.detectChanges();
        component.showMeQuestionFault = CompetencyOutcome.D;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.toggleShowMeQuestion();

        expect(storeDisptachSpy).not.toHaveBeenCalled();
      });

      it('should dispatch SHOW_ME_QUESTION_REMOVE_FAULT when show me has pass outcome', () => {
        fixture.detectChanges();
        component.showMeQuestionFault = CompetencyOutcome.P;

        const storeDisptachSpy = spyOn(store$, 'dispatch');

        component.toggleShowMeQuestion();

        expect(storeDisptachSpy).toHaveBeenCalledWith(ShowMeQuestionRemoveFault(CompetencyOutcome.P));
      });
    });
  });

  describe('DOM', () => {
    it('should pass 0 driving faults to the driving faults badge component when no tell me fault', () => {
      store$.dispatch(TellMeQuestionCorrect());
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(0);
    });

    it('should pass 1 driving faults to the driving faults badge component when there is a tell me fault', () => {
      store$.dispatch(TellMeQuestionDrivingFault());
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);
    });

    it('should pass 1 driving faults to the driving faults badge component when there is a show me fault', () => {
      store$.dispatch(ShowMeQuestionDrivingFault());
      fixture.detectChanges();
      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(1);
    });

    it('should have a serious fault badge on if there was serious fault recorded against the show me question', () => {
      store$.dispatch(ShowMeQuestionSeriousFault());
      fixture.detectChanges();
      const seriousFaultBadge = fixture.debugElement.query(By.css('serious-fault-badge'))
        .componentInstance as SeriousFaultBadgeComponent;

      fixture.detectChanges();
      expect(seriousFaultBadge.showBadge).toBe(true);
    });

    it('should have a serious fault badge on if tell me has driving fault but show me has serious', () => {
      store$.dispatch(TellMeQuestionDrivingFault());
      store$.dispatch(ShowMeQuestionSeriousFault());
      fixture.detectChanges();

      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(0);

      const seriousFaultBadge = fixture.debugElement.query(By.css('serious-fault-badge'))
        .componentInstance as SeriousFaultBadgeComponent;

      fixture.detectChanges();
      expect(seriousFaultBadge.showBadge).toBe(true);
    });

    it('should have a dangerous fault badge on if there was serious fault recorded against show me question', () => {
      store$.dispatch(ShowMeQuestionDangerousFault());
      fixture.detectChanges();
      const dangerousFaultBadge = fixture.debugElement.query(By.css('dangerous-fault-badge'))
        .componentInstance as DangerousFaultBadgeComponent;

      fixture.detectChanges();
      expect(dangerousFaultBadge.showBadge).toBe(true);
    });

    it('should have a dangerous fault badge on if tell me has driving fault but show me has dangerous', () => {
      store$.dispatch(TellMeQuestionDrivingFault());
      store$.dispatch(ShowMeQuestionDangerousFault());
      fixture.detectChanges();

      const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults'))
        .componentInstance as DrivingFaultsBadgeComponent;

      fixture.detectChanges();
      expect(drivingFaultsBadge.count).toBe(0);

      const dangerousFaultBadge = fixture.debugElement.query(By.css('dangerous-fault-badge'))
        .componentInstance as DangerousFaultBadgeComponent;

      fixture.detectChanges();
      expect(dangerousFaultBadge.showBadge).toBe(true);
    });
  });
});
