import { ComponentFixture, async, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, NavController, NavParams, Config, Platform } from '@ionic/angular';
import { NavControllerMock, NavParamsMock, ConfigMock, PlatformMock } from 'ionic-mocks';
import { StoreModule, Store } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '@app/app.module';
import { WaitingRoomToCarCatADIPart2Page } from '../waiting-room-to-car.cat-adi-part2.page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { StoreModel } from '@shared/models/store.model';
import {
  EyesightFailureConfirmationComponent,
} from '../../components/eyesight-failure-confirmation/eyesight-failure-confirmation';
import { QuestionProvider } from '@providers/question/question';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { PersistTests } from '@store/tests/tests.actions';
import { VehicleRegistrationComponent } from '../../components/vehicle-registration/vehicle-registration';
import { VehicleDetailsCardComponent } from '../../components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '../../components/vehicle-details/vehicle-details';
import { AccompanimentComponent } from '../../components/accompaniment/accompaniment';
import { EyesightTestComponent } from '../../components/eyesight-test/eyesight-test';
import { WaitingRoomToCarValidationError } from '../../waiting-room-to-car.actions';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import {
  AccompanimentCardCatADIPart2Component,
} from '../components/accompaniment-card/accompaniment-card.cat-adi-part2';
import { VehicleChecksCatADIPart2Component } from '../components/vehicle-checks/vehicle-checks.cat-adi-part2';
import { OrditTrainerCatAdiPart2Component } from '../components/ordit-trainer/ordit-trainer.cat-adi-part2';
import { TrainingRecordsCatAdiPart2Component } from '../components/training-records/training-records.cat-adi-part2';
import {
  TrainerRegistrationNumberCatAdiPart2Component,
} from '../components/trainer-registration-number/trainer-registration-number.cat-adi-part2';

describe('WaitingRoomToCarCatADIPart2Page', () => {
  let fixture: ComponentFixture<WaitingRoomToCarCatADIPart2Page>;
  let component: WaitingRoomToCarCatADIPart2Page;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        WaitingRoomToCarCatADIPart2Page,
        MockComponent(EyesightTestComponent),
        MockComponent(EyesightFailureConfirmationComponent),
        MockComponent(EndTestLinkComponent),
        MockComponent(VehicleRegistrationComponent),
        MockComponent(TransmissionComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(VehicleDetailsComponent),
        MockComponent(AccompanimentCardCatADIPart2Component),
        MockComponent(AccompanimentComponent),
        MockComponent(VehicleChecksCatADIPart2Component),
        MockComponent(OrditTrainerCatAdiPart2Component),
        MockComponent(TrainingRecordsCatAdiPart2Component),
        MockComponent(TrainerRegistrationNumberCatAdiPart2Component),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                vehicleDetails: {},
                trainerDetails: {
                  orditTrainedCandidate: null,
                  trainingRecords: null,
                  trainerRegistrationNumber: null,
                },
                accompaniment: {},
                testData: {
                  vehicleChecks: {
                    tellMeQuestion: [{
                      code: 'T1',
                      description: 'desc',
                      outcome: CompetencyOutcome.P,
                    }],
                  },
                  seriousFaults: [],
                  eyesightTest: {},
                },
                journalData: {
                  candidate: {
                    candidateName: 'Joe Bloggs',
                  },
                },
              },
            },
          }),
        }),
      ],
      providers: [
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: QuestionProvider, useClass: QuestionProviderMock },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WaitingRoomToCarCatADIPart2Page);
    component = fixture.componentInstance;
    store$ = TestBed.get(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should get tell me question from the question provider', () => {
      expect(component.tellMeQuestions.length).toBe(2);
    });
  });

  describe('DOM', () => {

    describe('eyesight failure confirmation', () => {

      // tslint:disable-next-line:max-line-length
      it('should hide the rest of the form and show eyesight failure confirmation when page state indicates fail is selected', () => {
        fixture.detectChanges();
        component.pageState.eyesightTestComplete$ = of(true);
        component.pageState.eyesightTestFailed$ = of(true);
        fixture.detectChanges();
        const eyesightFailureConfirmation = fixture.debugElement.query(By.css('eyesight-failure-confirmation'));
        const formAfterEyesight = fixture.debugElement.query(By.css('#post-eyesight-form-content'));
        expect(eyesightFailureConfirmation).not.toBeNull();
        expect(formAfterEyesight.nativeElement.hidden).toEqual(true);
      });
      // tslint:disable-next-line:max-line-length
      it('should show the rest of the form and not render eyesight failure confirmation when page state indicates pass is selected', () => {
        fixture.detectChanges();
        component.pageState.eyesightTestComplete$ = of(true);
        fixture.detectChanges();
        const eyesightFailureConfirmation = fixture.debugElement.query(By.css('eyesight-failure-confirmation'));
        const formAfterEyesight = fixture.debugElement.query(By.css('#post-eyesight-form-content'));
        expect(eyesightFailureConfirmation).toBeNull();
        expect(formAfterEyesight.nativeElement.hidden).toEqual(false);
      });
      it('should dispatch an EyesightResultReset action when the when the method is called', () => {
        component.eyesightFailCancelled();
        expect(store$.dispatch).toHaveBeenCalledWith(EyesightTestReset());
      });
    });

  });
  describe('ionViewWillLeave', () => {
    it('should dispatch the PersistTests action', () => {
      component.ionViewWillLeave();
      expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
    });
  });
  describe('onSubmit', () => {
    it('should dispatch the appropriate WaitingRoomToCarValidationError actions', fakeAsync(() => {
      component.form = new FormGroup({
        requiredControl1: new FormControl(null, [Validators.required]),
        requiredControl2: new FormControl(null, [Validators.required]),
        notRequiredControl: new FormControl(null),
      });

      component.onSubmit();
      tick();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl1 is blank'));
      expect(store$.dispatch)
        .toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl2 is blank'));
      expect(store$.dispatch)
        .not
        .toHaveBeenCalledWith(WaitingRoomToCarValidationError('notRequiredControl is blank'));
    }));
  });
});
