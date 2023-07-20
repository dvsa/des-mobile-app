import {
  ComponentFixture, fakeAsync, TestBed, tick, waitForAsync,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { PlatformMock, RouterMock } from '@mocks/index.mock';
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
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
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
import { TestResultCatAM2Schema } from '@dvsa/mes-test-schema/categories/AM2';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import {
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import {
  WaitingRoomToCarCatAMod2Page,
} from '@pages/waiting-room-to-car/cat-a-mod2/waiting-room-to-car.cat-a-mod2.page';
import { EyesightTestComponent } from '@pages/waiting-room-to-car/components/eyesight-test/eyesight-test';
import {
  EyesightFailureConfirmationComponent,
} from '@pages/waiting-room-to-car/components/eyesight-failure-confirmation/eyesight-failure-confirmation';
import {
  AlternativeMotEvidence,
} from '@pages/waiting-room-to-car/components/alternative-mot-evidence/alternative-mot-evidence';
import {
  AlternativeMotEvidenceDetails,
} from '@pages/waiting-room-to-car/components/alternative-mot-evidence-details/alternative-mot-evidence-details';

describe('WaitingRoomToCarCatAMod2Page', () => {
  let component: WaitingRoomToCarCatAMod2Page;
  let fixture: ComponentFixture<WaitingRoomToCarCatAMod2Page>;
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
          category: TestCategory.EUAM2,
          testData: {
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
        } as TestResultCatAM2Schema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        WaitingRoomToCarCatAMod2Page,
        MockComponent(EndTestLinkComponent),
        MockComponent(EyesightTestComponent),
        MockComponent(EyesightFailureConfirmationComponent),
        MockComponent(VehicleRegistrationComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(VehicleDetailsComponent),
        MockComponent(AccompanimentCardComponent),
        MockComponent(AccompanimentComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(TransmissionComponent),
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

    fixture = TestBed.createComponent(WaitingRoomToCarCatAMod2Page);
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
    describe('eyesightFailCancelled', () => {
      it('should reset eyesight control', () => {
        const control = new UntypedFormControl('value');
        component.form.addControl('eyesightCtrl', control);
        component.eyesightFailCancelled();
        expect(component.form.get('eyesightCtrl').value)
          .toEqual(null);
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
        component.testCategory = TestCategory.EUAM2;
        await component.onSubmit();
        tick();
        expect(routeByCategoryProvider.navigateToPage)
          .toHaveBeenCalledWith(
            TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.EUAM2, { replaceUrl: true },
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
