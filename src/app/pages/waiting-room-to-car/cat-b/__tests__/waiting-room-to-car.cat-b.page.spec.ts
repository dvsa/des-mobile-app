import {
  ComponentFixture, fakeAsync, TestBed, tick, waitForAsync,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { provideMockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {
  UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import {
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import {
  QuestionOutcomes,
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { StoreModel } from '@shared/models/store.model';
import { EyesightTestComponent } from '@pages/waiting-room-to-car/components/eyesight-test/eyesight-test';
import {
  EyesightFailureConfirmationComponent,
} from '@pages/waiting-room-to-car/components/eyesight-failure-confirmation/eyesight-failure-confirmation';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import {
  TellMeQuestionCardComponent,
} from '@pages/waiting-room-to-car/cat-b/components/tell-me-question-card/tell-me-question-card';
import { TellMeQuestionComponent } from '@pages/waiting-room-to-car/cat-b/components/tell-me-question/tell-me-question';
import {
  TellMeQuestionOutcomeComponent,
} from '@pages/waiting-room-to-car/cat-b/components/tell-me-question-outcome/tell-me-question-outcome';
import {
  VehicleRegistrationComponent,
} from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';
import {
  InstructorRegistrationComponent,
} from '@pages/waiting-room-to-car/cat-b/components/instructor-registration/instructor-registration';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import {
  VehicleDetailsCardComponent,
} from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '@pages/waiting-room-to-car/components/vehicle-details/vehicle-details';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { TestsModel } from '@store/tests/tests.model';
import { AppInfoStateModel } from '@store/app-info/app-info.model';

import { AppModule } from '@app/app.module';
import { WaitingRoomToCarCatBPage } from '../waiting-room-to-car.cat-b.page';

describe('WaitingRoomToCarCatBPage', () => {
  let component: WaitingRoomToCarCatBPage;
  let fixture: ComponentFixture<WaitingRoomToCarCatBPage>;
  let store$: Store<StoreModel>;
  let routeByCategoryProvider: RouteByCategoryProvider;
  const initialState = {
    appInfo: { versionNumber: '4.0' } as AppInfoStateModel,
    tests: {
      currentTest: { slotId: '123' },
      testStatus: {},
      startedTests: {
        123: {
          vehicleDetails: {},
          accompaniment: {},
          instructorDetails: { registrationNumber: 237489 },
          testData: {
            vehicleChecks: {
              tellMeQuestion: { code: 'T1', description: 'desc', outcome: CompetencyOutcome.P },
            },
            eyesightTest: {},
            seriousFaults: {},
          },
          journalData: {
            candidate: { candidateName: { firstName: 'Joe', lastName: 'Bloggs' } },
          },
        } as TestResultSchemasUnion,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        WaitingRoomToCarCatBPage,
        MockComponent(EyesightTestComponent),
        MockComponent(EyesightFailureConfirmationComponent),
        MockComponent(EndTestLinkComponent),
        MockComponent(TellMeQuestionCardComponent),
        MockComponent(TellMeQuestionComponent),
        MockComponent(TellMeQuestionOutcomeComponent),
        MockComponent(VehicleRegistrationComponent),
        MockComponent(InstructorRegistrationComponent),
        MockComponent(TransmissionComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(VehicleDetailsComponent),
        MockComponent(AccompanimentCardComponent),
        MockComponent(AccompanimentComponent),
        MockComponent(PracticeModeBanner),
      ],
      imports: [
        AppModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useClass: RouterMock },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(WaitingRoomToCarCatBPage);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store$ = TestBed.inject(Store);
    routeByCategoryProvider = TestBed.inject(RouteByCategoryProvider);
    spyOn(store$, 'dispatch');
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should call through to the base page init method', () => {
        spyOn(WaitingRoomToCarBasePageComponent.prototype, 'onInitialisation');
        component.ngOnInit();
        expect(WaitingRoomToCarBasePageComponent.prototype.onInitialisation).toHaveBeenCalled();
      });
    });
    describe('ionViewDidEnter', () => {
      it('should call through to the base page ionViewDidEnter', () => {
        spyOn(WaitingRoomToCarBasePageComponent.prototype, 'ionViewDidEnter');
        component.ionViewDidEnter();
        expect(WaitingRoomToCarBasePageComponent.prototype.ionViewDidEnter).toHaveBeenCalled();
      });
    });
    describe('ionViewWillLeave', () => {
      it('should call through to the base page ionViewWillLeave', () => {
        spyOn(WaitingRoomToCarBasePageComponent.prototype, 'ionViewWillLeave');
        component.ionViewWillLeave();
        expect(WaitingRoomToCarBasePageComponent.prototype.ionViewWillLeave).toHaveBeenCalled();
      });
    });
    describe('onSubmit', () => {
      beforeEach(() => {
        spyOn(routeByCategoryProvider, 'navigateToPage');
      });
      it('should recongnise a valid form and navigate to test report', fakeAsync(async () => {
        component.form = new UntypedFormGroup({
          notRequiredControl: new UntypedFormControl(null),
        });
        component.testCategory = TestCategory.B;
        await component.onSubmit();
        tick();
        expect(routeByCategoryProvider.navigateToPage).toHaveBeenCalledWith(
          TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.B, { replaceUrl: true },
        );
      }));
      it('should dispatch the appropriate WaitingRoomToCarValidationError actions', fakeAsync(async () => {
        component.form = new UntypedFormGroup({
          requiredControl1: new UntypedFormControl(null, [Validators.required]),
          requiredControl2: new UntypedFormControl(null, [Validators.required]),
          notRequiredControl: new UntypedFormControl(null),
        });

        await component.onSubmit();
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
    describe('eyesightFailCancelled', () => {
      it('should dispatch the action EyesightTestReset', () => {
        component.eyesightFailCancelled();
        expect(store$.dispatch).toHaveBeenCalledWith(EyesightTestReset());
      });
    });
    describe('tellMeQuestionChanged', () => {
      it('should dispatch an action when the tell me question change handler is called', () => {
        const question: VehicleChecksQuestion = {
          code: 'T1',
          description: 'desc',
          shortName: 'name',
        };
        component.tellMeQuestionChanged(question);
        expect(store$.dispatch).toHaveBeenCalledWith(TellMeQuestionSelected(question));
      });
    });
    describe('tellMeQuestionOutcomeChanged', () => {
      it('should dispatch TellMeQuestionCorrect when outcome is a pass', () => {
        const outcome: QuestionOutcomes = QuestionOutcomes.Pass;
        component.tellMeQuestionOutcomeChanged(outcome);
        expect(store$.dispatch).toHaveBeenCalledWith(TellMeQuestionCorrect());
      });
      it('should dispatch TellMeQuestionDrivingFault when outcome is not a pass', () => {
        const outcome: QuestionOutcomes = QuestionOutcomes.DrivingFault;
        component.tellMeQuestionOutcomeChanged(outcome);
        expect(store$.dispatch).toHaveBeenCalledWith(TellMeQuestionDrivingFault());
      });
    });
  });
  describe('DOM', () => {
    describe('eyesight failure confirmation', () => {
      // eslint-disable-next-line max-len
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
      // eslint-disable-next-line max-len
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
});
