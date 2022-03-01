import {
  ComponentFixture, TestBed, tick, fakeAsync, waitForAsync,
} from '@angular/core/testing';
import {
  IonicModule, ModalController, NavController, Platform,
} from '@ionic/angular';
import { NavControllerMock, PlatformMock } from 'ionic-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { Store } from '@ngrx/store';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { NonPassFinalisationPage } from '@pages/non-pass-finalisation/non-pass-finalisation.page';
import { ActivityCodeComponent } from '@components/common/activity-code/activity-code';
import * as testActions from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import {
  DebriefWitnessed, D255Yes, D255No, DebriefUnWitnessed,
} from '@store/tests/test-summary/test-summary.actions';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import {
  CandidateChoseToProceedWithTestInWelsh,
  CandidateChoseToProceedWithTestInEnglish,
} from '@store/tests/communication-preferences/communication-preferences.actions';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import {
  ActivityCodeFinalisationMock,
} from '@providers/activity-code-finalisation/__mocks__/activity-code-finalisation.mock';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { NonPassFinalisationViewDidEnter, NonPassFinalisationValidationError } from '../non-pass-finalisation.actions';

describe('NonPassFinalisationPage', () => {
  let fixture: ComponentFixture<NonPassFinalisationPage>;
  let component: NonPassFinalisationPage;
  let store$: Store<StoreModel>;
  let router: Router;
  const activatedRouteMock = { snapshot: { data: { behaviourMap: {} } } as Data } as ActivatedRoute;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        NonPassFinalisationPage,
        MockComponent(PracticeModeBanner),
        MockComponent(ActivityCodeComponent),
        MockComponent(D255Component),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(FinalisationHeaderComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: Router, useClass: RouterMock },
        { provide: NavController, useClass: NavControllerMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: ActivityCodeFinalisationProvider, useClass: ActivityCodeFinalisationMock },
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(NonPassFinalisationPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should dispatch a view did enter action', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(NonPassFinalisationViewDidEnter());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    describe('d255Changed', () => {
      it('should dispatch the correct action if the inputted value is true', () => {
        component.d255Changed(true);
        expect(store$.dispatch).toHaveBeenCalledWith(D255Yes());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the inputted value is false', () => {
        component.d255Changed(false);
        expect(store$.dispatch).toHaveBeenCalledWith(D255No());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    describe('debriefWitnessedChanged', () => {
      it('should dispatch the correct action if the inputted value is true', () => {
        component.debriefWitnessedChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(DebriefWitnessed());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the inputted value is false', () => {
        component.debriefWitnessedChanged(false);
        expect(store$.dispatch).toHaveBeenCalledWith(DebriefUnWitnessed());
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    describe('isWelshChanged', () => {
      it('should dispatch the correct action if the isWelsh flag is true', () => {
        component.isWelshChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInWelsh('Cymraeg'));
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
      it('should dispatch the correct action if the isWelsh flag is false', () => {
        component.isWelshChanged(false);
        expect(store$.dispatch).toHaveBeenCalledWith(CandidateChoseToProceedWithTestInEnglish('English'));
        expect(store$.dispatch).toHaveBeenCalledTimes(1);
      });
    });
    describe('continue', () => {
      it(`should create the TestFinalisationInvalidTestDataModal 
      when activityCode is 5 and no S/D faults`, async () => {
        store$.dispatch(testActions.StartTest(123, TestCategory.B));
        spyOn(component, 'openTestDataValidationModal').and.callThrough();
        spyOn(component.modalController, 'create').and.callThrough();
        spyOn(component.activityCodeFinalisationProvider, 'testDataIsInvalid').and.returnValue(Promise.resolve(true));

        component.slotId = '123';
        component.activityCode = {
          activityCode: ActivityCodes.FAIL_CANDIDATE_STOPS_TEST,
          description: ActivityCodeDescription.FAIL_CANDIDATE_STOPS_TEST,
        };
        component.testData = {
          dangerousFaults: {},
          seriousFaults: {},
        };

        // Act
        await component.continue();

        // Assert
        expect(component.openTestDataValidationModal).toHaveBeenCalled();
        expect(component.modalController.create).toHaveBeenCalled();
      });

      it(`should create the TestFinalisationInvalidTestDataModal 
      when activityCode is 4 and no S/D faults`, async () => {
        // Arrange
        store$.dispatch(testActions.StartTest(123, TestCategory.B));
        spyOn(component, 'openTestDataValidationModal').and.callThrough();
        spyOn(component.modalController, 'create')
          .and
          .callThrough();
        spyOn(component.activityCodeFinalisationProvider, 'testDataIsInvalid')
          .and
          .returnValue(Promise.resolve(true));

        component.slotId = '123';
        component.activityCode = {
          activityCode: ActivityCodes.FAIL_PUBLIC_SAFETY,
          description: ActivityCodeDescription.FAIL_PUBLIC_SAFETY,
        };
        component.testData = {
          dangerousFaults: {},
          seriousFaults: {},
        };

        // Act
        await component.continue();

        // Assert
        expect(component.openTestDataValidationModal).toHaveBeenCalled();
        expect(component.modalController.create).toHaveBeenCalled();
      });

      it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
        component.form = new FormGroup({
          requiredControl1: new FormControl(null, [Validators.required]),
          requiredControl2: new FormControl(null, [Validators.required]),
          notRequiredControl: new FormControl(null),
        });

        component.activityCode = {
          activityCode: ActivityCodes.FAIL,
          description: ActivityCodeDescription.FAIL,
        };
        component.testData = {
          dangerousFaults: {},
          seriousFaults: {},
        };

        component.continue();
        tick();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(NonPassFinalisationValidationError('requiredControl1 is blank'));
        expect(store$.dispatch)
          .toHaveBeenCalledWith(NonPassFinalisationValidationError('requiredControl2 is blank'));
        expect(store$.dispatch)
          .not
          .toHaveBeenCalledWith(NonPassFinalisationValidationError('notRequiredControl is blank'));
      }));
    });
    describe('navigateToDebrief', () => {
      it('should call the back method from Location to navigate back to Debrief', async () => {
        await component.navigateToDebrief();
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
      });
    });
    describe('showD255', () => {
      it('Hide D255 when category C3a', async () => {
        component.testCategory = TestCategory.C;
        expect(component.showD255()).toEqual(true);
      });
      it('Show D255 when is not category C3a', async () => {
        component.testCategory = TestCategory.CM;
        expect(component.showD255()).toEqual(false);
      });
    });
});
});
