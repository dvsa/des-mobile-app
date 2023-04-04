import { IonicModule, NavController } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { StoreModule, Store } from '@ngrx/store';
import { NavControllerMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';

import { testsReducer } from '@store/tests/tests.reducer';
import { StoreModel } from '@shared/models/store.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { ToolbarComponent } from '../toolbar';
import { DrivingFaultSummaryComponent } from '../../driving-fault-summary/driving-fault-summary';
import { SeriousTooltipComponent } from '../../serious-tooltip/serious-tooltip';
import { ToggleRemoveFaultMode, ToggleSeriousFaultMode, ToggleDangerousFaultMode } from '../../../test-report.actions';
import { testReportReducer } from '../../../test-report.reducer';
import { DangerousTooltipComponent } from '../../dangerous-tooltip/dangerous-tooltip';
import { TimerComponent } from '../../timer/timer';

describe('ToolbarComponent', () => {
  let fixture: ComponentFixture<ToolbarComponent>;
  let component: ToolbarComponent;
  let store$: Store<StoreModel>;
  let storeDispatchSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ToolbarComponent,
        MockComponent(DrivingFaultSummaryComponent),
        MockComponent(SeriousTooltipComponent),
        MockComponent(DangerousTooltipComponent),
        MockComponent(TimerComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer, testReport: testReportReducer }),
      ],
      providers: [
        { provide: NavController, useClass: NavControllerMock },
        { provide: FaultCountProvider, useClass: FaultCountProvider },
      ],
    });

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    storeDispatchSpy = spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('togglRemoveFaultMode', () => {
      it('should dispatch a TOGGLE_REMOVE_FAULT_MODE action', () => {
        component.toggleRemoveFaultMode();
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode(true));
      });
      it('should not dispatch if shouldDisable is true', () => {
        component.toggleRemoveFaultMode(true);
        expect(storeDispatchSpy).not.toHaveBeenCalled();
      });
    });
    describe('toggleSeriousMode', () => {
      it('should dispatch a TOGGLE_SERIOUS_FAULT_MODE action', () => {
        component.toggleSeriousMode();

        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode(true));
      });
      it('should dispatch a TOGGLE_DANGEROUS_FAULT_MODE action if dangerous mode is active', () => {
        component.isDangerousMode = true;
        component.toggleSeriousMode();

        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
      });

    });

    describe('toggleDangerousMode', () => {
      it('should dispatch a TOGGLE_DANGEROUS_FAULT_MODE action', () => {
        component.toggleDangerousMode();
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode(true));
      });
      it('should dispatch ToggleSeriousFaultMode if isSeriousMode is true', () => {
        component.isSeriousMode = true;
        component.toggleDangerousMode();
        expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
      });
    });
  });

  describe('currentTestHasFaults', () => {
    it('should return false if drivingFaultCount is more than 0', () => {
      spyOn(component['faultCountProvider'], 'getDrivingFaultSumCount').and.returnValue(1);
      spyOn(component['faultCountProvider'], 'getSeriousFaultSumCount').and.returnValue(0);
      spyOn(component['faultCountProvider'], 'getDangerousFaultSumCount').and.returnValue(0);

      expect(component.currentTestHasFaults(null, null)).toEqual(false);
    });
    it('should return false if seriousFaultCount is more than 0', () => {
      spyOn(component['faultCountProvider'], 'getDrivingFaultSumCount').and.returnValue(0);
      spyOn(component['faultCountProvider'], 'getSeriousFaultSumCount').and.returnValue(1);
      spyOn(component['faultCountProvider'], 'getDangerousFaultSumCount').and.returnValue(0);

      expect(component.currentTestHasFaults(null, null)).toEqual(false);
    });
    it('should return false if dangerousFaultCount is more than 0', () => {
      spyOn(component['faultCountProvider'], 'getDrivingFaultSumCount').and.returnValue(0);
      spyOn(component['faultCountProvider'], 'getSeriousFaultSumCount').and.returnValue(0);
      spyOn(component['faultCountProvider'], 'getDangerousFaultSumCount').and.returnValue(1);

      expect(component.currentTestHasFaults(null, null)).toEqual(false);
    });
    it('should return true if all counts are 0', () => {
      spyOn(component['faultCountProvider'], 'getDrivingFaultSumCount').and.returnValue(0);
      spyOn(component['faultCountProvider'], 'getSeriousFaultSumCount').and.returnValue(0);
      spyOn(component['faultCountProvider'], 'getDangerousFaultSumCount').and.returnValue(0);

      expect(component.currentTestHasFaults(null, null)).toEqual(true);
    });
  });

  describe('DOM', () => {
    it('should not show any tooltips in default mode', () => {

      fixture.detectChanges();
      expect(component.isSeriousMode).toEqual(false);
      expect(component.isDangerousMode).toEqual(false);

      expect(fixture.debugElement.query(By.css('#serious-button'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('#dangerous-button'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('driving-faults-badge'))).toBeDefined();

      expect(fixture.debugElement.query(By.css('serious-tooltip'))).toBeNull();
      expect(fixture.debugElement.query(By.css('dangerous-tooltip'))).toBeNull();
    });
    it('should show the correct components when serious mode is activated', () => {

      fixture.detectChanges();

      component.isSeriousMode = true;

      fixture.detectChanges();

      expect(component.isSeriousMode).toEqual(true);
      expect(component.isDangerousMode).toEqual(false);
      expect(component.isRemoveFaultMode).toEqual(false);

      expect(fixture.debugElement.query(By.css('#serious-button'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('serious-tooltip'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('#dangerous-button'))).toBeDefined();

      expect(fixture.debugElement.query(By.css('driving-faults-badge'))).toBeNull();
      expect(fixture.debugElement.query(By.css('dangerous-tooltip'))).toBeNull();
    });
    it('should show the correct components when dangerous mode is actived', () => {

      fixture.detectChanges();

      component.isDangerousMode = true;

      fixture.detectChanges();
      expect(component.isRemoveFaultMode).toEqual(false);
      expect(component.isSeriousMode).toEqual(false);
      expect(component.isDangerousMode).toEqual(true);

      expect(fixture.debugElement.query(By.css('#serious-button'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('#dangerous-button'))).toBeDefined();
      expect(fixture.debugElement.query(By.css('dangerous-tooltip'))).toBeDefined();

      expect(fixture.debugElement.query(By.css('driving-faults-badge'))).toBeNull();
      expect(fixture.debugElement.query(By.css('serious-tooltip'))).toBeNull();

    });
  });
});
