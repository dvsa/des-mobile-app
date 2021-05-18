
import { IonicModule } from 'ionic-angular';
import { TimerComponent } from '../timer';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { StoreModel } from '../../../../../shared/models/store.model';
import { Store, StoreModule } from '@ngrx/store';
import { testsReducer } from '../../../../../modules/tests/tests.reducer';
import { testReportReducer } from '../../../test-report.reducer';
import { StartTimer } from '../../../test-report.actions';

describe('TimerComponent', () => {
  let fixture: ComponentFixture<TimerComponent>;
  let component: TimerComponent;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TimerComponent,
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({ tests: testsReducer, testReport: testReportReducer }),
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    store$ = TestBed.get(Store);
  }));

  describe('Class', () => {
    describe('startTimer', () => {
      it('should dispatch the start timer action, hide the start test button and set up an interval', () => {
        const storeDispatchSpy = spyOn(store$, 'dispatch');
        component.startTimer();
        expect(storeDispatchSpy).toHaveBeenCalledWith(new StartTimer());
        expect(component.showStartTimerButton).toEqual(false);
        expect(component.interval).not.toBeUndefined();
      });
    });
    describe('generateTimerString', () => {
      it('should create the correct string when given 5 seconds', () => {
        component.seconds = 5;
        component.generateTimerString();
        expect(component.timerString).toBe('00:00:05');
      });
      it('should create the correct string when given 30 seconds', () => {
        component.seconds = 30;
        component.generateTimerString();
        expect(component.timerString).toBe('00:00:30');
      });
      it('should create the correct string when given 5 mins', () => {
        component.seconds = 300;
        component.generateTimerString();
        expect(component.timerString).toBe('00:05:00');
      });
      it('should create the correct string when given 30 mins', () => {
        component.seconds = 1800;
        component.generateTimerString();
        expect(component.timerString).toBe('00:30:00');
      });
      it('should create the correct string when given 5 hours', () => {
        component.seconds = 18000;
        component.generateTimerString();
        expect(component.timerString).toBe('05:00:00');
      });
      it('should create the correct string when given 15 hours', () => {
        component.seconds = 54000;
        component.generateTimerString();
        expect(component.timerString).toBe('15:00:00');
      });
    });

  });

  describe('DOM', () => {

  });
});
