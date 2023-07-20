import {
  ComponentFixture, fakeAsync, TestBed, tick, waitForAsync,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformMock, RouterMock } from '@mocks/index.mock';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import {
  VehicleRegistrationComponent,
} from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';
import { MockComponent } from 'ng-mocks';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import {
  VehicleDetailsCardComponent,
} from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '@pages/waiting-room-to-car/components/vehicle-details/vehicle-details';
import {
  AccompanimentCardComponent,
} from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { VehicleChecksComponent } from '@pages/waiting-room-to-car/components/vehicle-checks/vehicle-checks';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import {
  VehicleChecksToggleComponent,
} from '@pages/waiting-room-to-car/components/vehicle-checks-completed/vehicle-checks-completed';
import {
  CandidateDeclarationSignedComponent,
} from '@pages/waiting-room-to-car/components/candidate-declaration/candidate-declaration';
import {
  FullLicenceHeldComponent,
} from '@pages/waiting-room-to-car/components/full-licence-held-toggle/full-licence-held-toggle';
import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { QuestionProvider } from '@providers/question/question';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import {
  ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { TestsModel } from '@store/tests/tests.model';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import {
  DropExtraVehicleChecks,
  DropExtraVehicleChecksDelegated,
  SetFullLicenceHeld,
  VehicleChecksCompletedToggled,
  VehicleChecksDrivingFaultsNumberChanged,
} from '@store/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { Subscription } from 'rxjs';
import {
  AlternativeMotEvidence,
} from '@pages/waiting-room-to-car/components/alternative-mot-evidence/alternative-mot-evidence';
import {
  AlternativeMotEvidenceDetails,
} from '@pages/waiting-room-to-car/components/alternative-mot-evidence-details/alternative-mot-evidence-details';
import { WaitingRoomToCarCatDPage } from '../waiting-room-to-car.cat-d.page';

describe('WaitingRoomToCarCatDPage', () => {
  let component: WaitingRoomToCarCatDPage;
  let fixture: ComponentFixture<WaitingRoomToCarCatDPage>;
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
          category: TestCategory.D,
          testData: {
            vehicleChecks: {
              tellMeQuestions: [{}],
              showMeQuestions: [{}],
              fullLicenceHeld: null,
            },
            seriousFaults: {},
          },
          journalData: {
            candidate: {
              candidateName: {
                firstName: 'Joe',
                lastName: 'Bloggs',
              },
            },
          },
        } as CatCUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        WaitingRoomToCarCatDPage,
        MockComponent(EndTestLinkComponent),
        MockComponent(VehicleRegistrationComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(VehicleDetailsComponent),
        MockComponent(AccompanimentCardComponent),
        MockComponent(AccompanimentComponent),
        MockComponent(VehicleChecksComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(VehicleChecksToggleComponent),
        MockComponent(CandidateDeclarationSignedComponent),
        MockComponent(FullLicenceHeldComponent),
        MockComponent(AlternativeMotEvidence),
        MockComponent(AlternativeMotEvidenceDetails),
      ],
      imports: [
        AppModule,
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: QuestionProvider,
          useClass: QuestionProviderMock,
        },
        {
          provide: FaultCountProvider,
          useClass: FaultCountProvider,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(WaitingRoomToCarCatDPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.form = new UntypedFormGroup({});

    store$ = TestBed.inject(Store);
    routeByCategoryProvider = TestBed.inject(RouteByCategoryProvider);
    spyOn(store$, 'dispatch');
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should call through to the base page init method', () => {
        spyOn(WaitingRoomToCarBasePageComponent.prototype, 'onInitialisation');
        component.ngOnInit();
        expect(WaitingRoomToCarBasePageComponent.prototype.onInitialisation)
          .toHaveBeenCalled();
      });
    });
    describe('vehicleChecksCompletedOutcomeChanged', () => {
      it('should dispatch the action VehicleChecksCompletedToggled with input', () => {
        component.vehicleChecksCompletedOutcomeChanged(true);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(VehicleChecksCompletedToggled(true));
      });
    });
    describe('vehicleChecksDrivingFaultsNumberChanged', () => {
      it('should dispatch the action VehicleChecksDrivingFaultsNumberChanged with input', () => {
        spyOn(component, 'generateDelegatedQuestionResults')
          .and
          .returnValue([]);
        component.vehicleChecksDrivingFaultsNumberChanged(0);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(VehicleChecksDrivingFaultsNumberChanged([]));
      });
    });
    describe('fullLicenceHeldChange', () => {
      it('should dispatch the action SetFullLicenceHeld with input', () => {
        component.fullLicenceHeldChange(false);
        expect(store$.dispatch)
          .toHaveBeenCalledWith(SetFullLicenceHeld(false));
      });
    });
    describe('showFullLicenceHeld', () => {
      [
        {
          cat: TestCategory.D,
          shouldShow: false,
        },
        {
          cat: TestCategory.D1,
          shouldShow: false,
        },
        {
          cat: TestCategory.DE,
          shouldShow: true,
        },
        {
          cat: TestCategory.D1E,
          shouldShow: true,
        },
      ].forEach(({
        cat,
        shouldShow,
      }) => {
        it(`should ${shouldShow ? 'show' : 'not show'} field for cat ${cat}`, () => {
          component.testCategory = cat;
          expect(component.showFullLicenceHeld())
            .toEqual(shouldShow);
        });
      });
    });
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from a subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });
    describe('displayLoadSecured', () => {
      it('should return true if the category is valid', () => {
        component.testCategory = TestCategory.DE;
        expect(component.displayLoadSecured())
          .toBeTruthy();
      });
      it('should return true if the category is not valid', () => {
        component.testCategory = TestCategory.ADI2;
        expect(component.displayLoadSecured())
          .toBeFalsy();
      });
    });
    describe('onSubmit', () => {
      beforeEach(() => {
        spyOn(routeByCategoryProvider, 'navigateToPage');
      });
      it('should dispatch DropExtraVehicleChecksDelegated if'
        + 'fullLicenceHeld, category is valid and isDelegated is true', () => {
        spyOn(component.store$, 'dispatch');
        component.testCategory = TestCategory.DE;
        component.isDelegated = true;
        component.fullLicenceHeld = true;
        component.onSubmit();
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(DropExtraVehicleChecksDelegated());
      });
      it('should dispatch DropExtraVehicleChecks if'
        + 'fullLicenceHeld, category is valid and isDelegated is false', () => {
        spyOn(component.store$, 'dispatch');
        component.testCategory = TestCategory.DE;
        component.isDelegated = false;
        component.fullLicenceHeld = true;
        component.onSubmit();
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(DropExtraVehicleChecks());
      });
      it('should recognise a valid form and navigate to test report', fakeAsync(async () => {
        component.form = new UntypedFormGroup({
          notRequiredControl: new UntypedFormControl(null),
        });
        component.testCategory = TestCategory.D;
        await component.onSubmit();
        tick();
        expect(routeByCategoryProvider.navigateToPage)
          .toHaveBeenCalledWith(
            TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.D, { replaceUrl: true },
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
  });
});
