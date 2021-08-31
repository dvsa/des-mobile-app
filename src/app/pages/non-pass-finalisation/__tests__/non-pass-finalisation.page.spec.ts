import {
  waitForAsync, ComponentFixture, TestBed,
} from '@angular/core/testing';
import { IonicModule, NavController, Platform } from '@ionic/angular';

import { NavControllerMock, PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { configureTestSuite } from 'ng-bullet';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockComponent } from 'ng-mocks';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { Subscription } from 'rxjs';
import { NonPassFinalisationViewDidEnter } from '@pages/non-pass-finalisation/non-pass-finalisation.actions';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
// import { TestResultProvider } from '@providers/test-result/test-result';
import { NonPassFinalisationPage } from '../non-pass-finalisation.page';

fdescribe('NonPassFinalisationPage', () => {
  let fixture: ComponentFixture<NonPassFinalisationPage>;
  let component: NonPassFinalisationPage;
  let store$: Store<StoreModel>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
  // let testResultProvider: TestResultProvider;
  // let activityCodeFinalisationProvider: ActivityCodeFinalisationProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        NonPassFinalisationPage,
        MockComponent(PracticeModeBanner),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(ActivityCodeComponent),
        MockComponent(D255Component),
        MockComponent(WarningBannerComponent),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(DebriefWitnessedComponent),
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: NavController, useClass: NavControllerMock },
        // TestResultProvider,
        ActivityCodeFinalisationProvider,
        OutcomeBehaviourMapProvider,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(NonPassFinalisationPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    // testResultProvider = TestBed.inject(TestResultProvider);
    // activityCodeFinalisationProvider = TestBed.inject(ActivityCodeFinalisationProvider);
    spyOn(store$, 'dispatch');
    component.subscription = new Subscription();
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should dispatch the VIEW_DID_ENTER action when the function is run', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(NonPassFinalisationViewDidEnter());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    // describe('onSubmit', () => {
    //   // Unit tests for the components TypeScript class
    //   it('should dispatch the PersistTests action', () => {
    //     component.onSubmit();
    //     expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
    //   });
    //
    //   it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
    //     component.form = new FormGroup({
    //       requiredControl1: new FormControl(null, [Validators.required]),
    //       requiredControl2: new FormControl(null, [Validators.required]),
    //       [PASS_CERTIFICATE_NUMBER_CTRL]: new FormControl(null, [Validators.required]),
    //       notRequiredControl: new FormControl(null),
    //     });
    //
    //     component.onSubmit();
    //     tick();
    //     expect(store$.dispatch)
    //       .toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl1 is blank'));
    //     expect(store$.dispatch)
    //       .toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl2 is blank'));
    //     expect(store$.dispatch)
    //       .toHaveBeenCalledWith(PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`));
    //     expect(store$.dispatch)
    //       .not
    //       .toHaveBeenCalledWith(PassFinalisationValidationError('notRequiredControl is blank'));
    //   }));
    // });

  });
});
