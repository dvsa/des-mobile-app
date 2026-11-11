import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { TransmissionComponent } from '@components/common/transmission/transmission';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { TestResultCatADI3Schema } from '@dvsa/mes-test-schema/categories/ADI3';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { OrditTrainerCatAdiPart2Component } from '@pages/waiting-room-to-car/cat-adi-part2/components/ordit-trainer/ordit-trainer.cat-adi-part2';
import { AccompanimentCardADI3Component } from '@pages/waiting-room-to-car/cat-adi-part3/components/accompaniment-card/accompaniment-card';
import { DualControlsComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/dual-controls/dual-controls';
import { PDILogbookComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/pdi-logbook/pdi-logbook';
import { TraineeLicenceComponent } from '@pages/waiting-room-to-car/cat-adi-part3/components/trainee-licence/trainee-licence';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { TestCategoryComponent } from '@pages/waiting-room-to-car/components/test-category/test-category';
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
import { TrainerAccompanimentToggled } from '@store/tests/accompaniment/cat-adi3/accompaniment.cat-adi3.actions';
import { TestsModel } from '@store/tests/tests.model';
import {
  PDILogbook,
  TraineeLicence,
} from '@store/tests/trainer-details/cat-adi-part3/trainer-details.cat-adi-part3.actions';
import { DualControlsToggledNo, DualControlsToggledYes } from '@store/tests/vehicle-details/vehicle-details.actions';
import { MockComponent } from 'ng-mocks';
import { TrainerRegistrationNumberCatAdiPart2Component } from '../../cat-adi-part2/components/trainer-registration-number/trainer-registration-number.cat-adi-part2';
import { WaitingRoomToCarCatADIPart3Page } from '../waiting-room-to-car.cat-adi-part3.page';

describe('WaitingRoomToCarCatADIPart3Page', () => {
  let component: WaitingRoomToCarCatADIPart3Page;
  let fixture: ComponentFixture<WaitingRoomToCarCatADIPart3Page>;
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
          category: TestCategory.ADI3,
          trainerDetails: {},
          journalData: {
            candidate: {
              candidateName: {
                firstName: 'Joe',
                lastName: 'Bloggs',
              },
            },
          },
        } as TestResultCatADI3Schema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        WaitingRoomToCarCatADIPart3Page,
        MockComponent(TestCategoryComponent),
        MockComponent(EndTestLinkComponent),
        MockComponent(VehicleRegistrationComponent),
        MockComponent(AccompanimentCardADI3Component),
        MockComponent(AccompanimentComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(TransmissionComponent),
        MockComponent(TrainerRegistrationNumberCatAdiPart2Component),
        MockComponent(OrditTrainerCatAdiPart2Component),
        MockComponent(PDILogbookComponent),
        MockComponent(TraineeLicenceComponent),
        MockComponent(DualControlsComponent),
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

    fixture = TestBed.createComponent(WaitingRoomToCarCatADIPart3Page);
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
    describe('dualControlsOutcomeToggled', () => {
      it('should dispatch DualControlsToggledYes() if dualControls is true', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.dualControlsOutcomeToggled(true);
        expect(component.store$.dispatch).toHaveBeenCalledWith(DualControlsToggledYes());
      });
      it('should dispatch DualControlsToggledNo() if dualControls is false', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.dualControlsOutcomeToggled(false);
        expect(component.store$.dispatch).toHaveBeenCalledWith(DualControlsToggledNo());
      });
    });
    describe('pdiLogbookChanged', () => {
      it('should dispatch with PDILogbook', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.pdiLogbookChanged(true);
        expect(component.store$.dispatch).toHaveBeenCalledWith(PDILogbook(true));
      });
    });
    describe('traineeLicenceChanged', () => {
      it('should dispatch with TraineeLicence', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.traineeLicenceChanged(true);
        expect(component.store$.dispatch).toHaveBeenCalledWith(TraineeLicence(true));
      });
    });
    describe('trainerAccompanimentChanged', () => {
      it('should dispatch with TrainerAccompanimentToggled', () => {
        vi.spyOn(component.store$, 'dispatch').mockReturnValue(undefined);
        component.trainerAccompanimentChanged();
        expect(component.store$.dispatch).toHaveBeenCalledWith(TrainerAccompanimentToggled());
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
          component.testCategory = TestCategory.ADI3;
          await component.onSubmit();
          await vi.advanceTimersByTimeAsync(0);
          expect(routeByCategoryProvider.navigateToPage).toHaveBeenCalledWith(
            TestFlowPageNames.TEST_REPORT_DASHBOARD_PAGE
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
