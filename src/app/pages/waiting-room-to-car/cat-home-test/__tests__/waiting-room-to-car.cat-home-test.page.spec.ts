import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { provideBasePageMocks } from '@mocks/test-providers';
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
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import { TestsModel } from '@store/tests/tests.model';
import { MockComponent } from 'ng-mocks';
import { WaitingRoomToCarCatHomeTestPage } from '../waiting-room-to-car.cat-home-test.page';

describe('WaitingRoomToCarCatHomeTestPage', () => {
  let component: WaitingRoomToCarCatHomeTestPage;
  let fixture: ComponentFixture<WaitingRoomToCarCatHomeTestPage>;
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
          category: TestCategory.F,
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        WaitingRoomToCarCatHomeTestPage,
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
      providers: [
        provideBasePageMocks(),
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
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

    fixture = TestBed.createComponent(WaitingRoomToCarCatHomeTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(Store);
    routeByCategoryProvider = TestBed.inject(RouteByCategoryProvider);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('ngOnInit', () => {
      it('should call through to the base page init method', () => {
        vi.spyOn(WaitingRoomToCarBasePageComponent.prototype, 'onInitialisation').mockReturnValue(undefined);
        component.ngOnInit();
        expect(WaitingRoomToCarBasePageComponent.prototype.onInitialisation).toHaveBeenCalled();
      });
    });
    describe('eyesightFailCancelled', () => {
      it('should call the dismiss method', () => {
        vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.eyesightFailCancelled();
        expect(component.store$.dispatch).toHaveBeenCalledWith(EyesightTestReset());
      });
      it('should reset the eyesightCtrl form property', () => {
        component.form.addControl('eyesightCtrl', new UntypedFormControl());
        component.form.controls.eyesightCtrl.setValue(1);
        component.eyesightFailCancelled();
        expect(component.form.controls.eyesightCtrl.value).toBe(null);
      });
    });

    describe('onSubmit', () => {
      beforeEach(() => {
        vi.spyOn(routeByCategoryProvider, 'navigateToPage').mockReturnValue(undefined);
      });
      it('should recognise a valid form and navigate to test report', async () => {
        vi.useFakeTimers();
        try {
          component.form = new UntypedFormGroup({
            notRequiredControl: new UntypedFormControl(null),
          });
          component.testCategory = TestCategory.F;
          await component.onSubmit();
          await vi.advanceTimersByTimeAsync(0);
          expect(routeByCategoryProvider.navigateToPage).toHaveBeenCalledWith(
            TestFlowPageNames.TEST_REPORT_PAGE,
            TestCategory.F,
            { replaceUrl: true }
          );
        } finally {
          vi.useRealTimers();
        }
      });
      it('should dispatch the appropriate WaitingRoomToCarValidationError actions', async () => {
        vi.useFakeTimers();
        try {
          component.form = new UntypedFormGroup({
            requiredControl1: new UntypedFormControl(null, [Validators.required]),
            requiredControl2: new UntypedFormControl(null, [Validators.required]),
            notRequiredControl: new UntypedFormControl(null),
          });
          await component.onSubmit();
          await vi.advanceTimersByTimeAsync(0);
          expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl1 is blank'));
          expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl2 is blank'));
          expect(store$.dispatch).not.toHaveBeenCalledWith(
            WaitingRoomToCarValidationError('notRequiredControl is blank')
          );
        } finally {
          vi.useRealTimers();
        }
      });
    });
  });
});
