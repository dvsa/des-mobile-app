import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppModule } from '@app/app.module';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Platform } from '@ionic/angular';
import { PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AccompanimentCardComponent } from '@pages/waiting-room-to-car/components/accompaniment-card/accompaniment-card';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { CandidateDeclarationSignedComponent } from '@pages/waiting-room-to-car/components/candidate-declaration/candidate-declaration';
import { FullLicenceHeldComponent } from '@pages/waiting-room-to-car/components/full-licence-held-toggle/full-licence-held-toggle';
import { VehicleChecksToggleComponent } from '@pages/waiting-room-to-car/components/vehicle-checks-completed/vehicle-checks-completed';
import { VehicleChecksComponent } from '@pages/waiting-room-to-car/components/vehicle-checks/vehicle-checks';
import { VehicleDetailsCardComponent } from '@pages/waiting-room-to-car/components/vehicle-details-card/vehicle-details-card';
import { VehicleDetailsComponent } from '@pages/waiting-room-to-car/components/vehicle-details/vehicle-details';
import { VehicleRegistrationComponent } from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { QuestionProvider } from '@providers/question/question';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { WaitingRoomToCarBasePageComponent } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { StoreModel } from '@shared/models/store.model';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import {
  SetFullLicenceHeld,
  VehicleChecksCompletedToggled,
  VehicleChecksDrivingFaultsNumberChanged,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { TestsModel } from '@store/tests/tests.model';
import { MockComponent } from 'ng-mocks';
import { Subscription } from 'rxjs';
import { WaitingRoomToCarCatCPage } from '../waiting-room-to-car.cat-c.page';

describe('WaitingRoomToCarCatCPage', () => {
  let component: WaitingRoomToCarCatCPage;
  let fixture: ComponentFixture<WaitingRoomToCarCatCPage>;
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
          category: TestCategory.C,
          testData: {
            vehicleChecks: { tellMeQuestions: [{}], showMeQuestions: [{}], fullLicenceHeld: null },
            seriousFaults: {},
          },
          journalData: {
            candidate: { candidateName: { firstName: 'Joe', lastName: 'Bloggs' } },
          },
        } as CatCUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        WaitingRoomToCarCatCPage,
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
      ],
      imports: [AppModule, ReactiveFormsModule],
      providers: [
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Router, useClass: RouterMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: QuestionProvider, useClass: QuestionProviderMock },
        { provide: FaultCountProvider, useClass: FaultCountProvider },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(WaitingRoomToCarCatCPage);
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
    describe('vehicleChecksCompletedOutcomeChanged', () => {
      it('should dispatch the action VehicleChecksCompletedToggled with input', () => {
        component.vehicleChecksCompletedOutcomeChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksCompletedToggled(true));
      });
    });
    describe('vehicleChecksDrivingFaultsNumberChanged', () => {
      it('should dispatch the action VehicleChecksDrivingFaultsNumberChanged with input', () => {
        spyOn(component, 'generateDelegatedQuestionResults').and.returnValue([]);
        component.vehicleChecksDrivingFaultsNumberChanged(0);
        expect(store$.dispatch).toHaveBeenCalledWith(VehicleChecksDrivingFaultsNumberChanged([]));
      });
    });
    describe('fullLicenceHeldChange', () => {
      it('should dispatch the action SetFullLicenceHeld with input', () => {
        component.fullLicenceHeldChange(false);
        expect(store$.dispatch).toHaveBeenCalledWith(SetFullLicenceHeld(false));
      });
    });
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from a subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });
    describe('showFullLicenceHeld', () => {
      [
        { cat: TestCategory.C, shouldShow: false },
        { cat: TestCategory.C1, shouldShow: false },
        { cat: TestCategory.CE, shouldShow: true },
        { cat: TestCategory.C1E, shouldShow: true },
      ].forEach(({ cat, shouldShow }) => {
        it(`should ${shouldShow ? 'show' : 'not show'} field for cat ${cat}`, () => {
          component.testCategory = cat;
          expect(component.showFullLicenceHeld()).toEqual(shouldShow);
        });
      });
    });
    describe('onSubmit', () => {
      beforeEach(() => {
        spyOn(routeByCategoryProvider, 'navigateToPage');
      });
      it('should recognise a valid form and navigate to test report', fakeAsync(async () => {
        component.form = new UntypedFormGroup({
          notRequiredControl: new UntypedFormControl(null),
        });
        component.testCategory = TestCategory.C;
        await component.onSubmit();
        tick();
        expect(routeByCategoryProvider.navigateToPage).toHaveBeenCalledWith(
          TestFlowPageNames.TEST_REPORT_PAGE,
          TestCategory.C,
          { replaceUrl: true }
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
        expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl1 is blank'));
        expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl2 is blank'));
        expect(store$.dispatch).not.toHaveBeenCalledWith(
          WaitingRoomToCarValidationError('notRequiredControl is blank')
        );
      }));
    });
  });
});
