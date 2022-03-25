import {
  ComponentFixture, fakeAsync, TestBed, tick, waitForAsync,
} from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { PlatformMock } from 'ionic-mocks';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { configureTestSuite } from 'ng-bullet';
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
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { provideMockStore } from '@ngrx/store/testing';
import { QuestionProvider } from '@providers/question/question';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { TestsModel } from '@store/tests/tests.model';
import { TestResultCatAM1Schema } from '@dvsa/mes-test-schema/categories/AM1';
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
  TrainingRecordsCatAdiPart2Component,
} from '@pages/waiting-room-to-car/cat-adi-part2/components/training-records/training-records.cat-adi-part2';
import {
  TrainerRegistrationNumberCatAdiPart2Component,
} from '@pages/waiting-room-to-car/cat-adi-part2/components/trainer-registration-number/trainer-registration-number.cat-adi-part2';
import {
  OrditTrainerCatAdiPart2Component,
} from '@pages/waiting-room-to-car/cat-adi-part2/components/ordit-trainer/ordit-trainer.cat-adi-part2';
import { WaitingRoomToCarCatADIPart2Page } from '../waiting-room-to-car.cat-adi-part2.page';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

describe('WaitingRoomToCarCatADIPart2Page', () => {
  let component: WaitingRoomToCarCatADIPart2Page;
  let fixture: ComponentFixture<WaitingRoomToCarCatADIPart2Page>;
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
          category: TestCategory.ADI2,
          trainerDetails: {},
          testData: {
            seriousFaults: {},
          },
          journalData: {
            candidate: { candidateName: { firstName: 'Joe', lastName: 'Bloggs' } },
          },
        } as CatADI2UniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        WaitingRoomToCarCatADIPart2Page,
        MockComponent(EndTestLinkComponent),
        MockComponent(VehicleRegistrationComponent),
        MockComponent(VehicleDetailsCardComponent),
        MockComponent(VehicleDetailsComponent),
        MockComponent(AccompanimentCardComponent),
        MockComponent(AccompanimentComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(TransmissionComponent),
        MockComponent(TrainingRecordsCatAdiPart2Component),
        MockComponent(TrainerRegistrationNumberCatAdiPart2Component),
        MockComponent(OrditTrainerCatAdiPart2Component),
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
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: QuestionProvider, useClass: QuestionProviderMock },
        { provide: FaultCountProvider, useClass: FaultCountProvider },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(WaitingRoomToCarCatADIPart2Page);
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
    describe('onSubmit', () => {
      beforeEach(() => {
        spyOn(routeByCategoryProvider, 'navigateToPage');
      });
      it('should recognise a valid form and navigate to test report', fakeAsync(async () => {
        component.form = new FormGroup({
          notRequiredControl: new FormControl(null),
        });
        component.testCategory = TestCategory.ADI2;
        await component.onSubmit();
        tick();
        expect(routeByCategoryProvider.navigateToPage).toHaveBeenCalledWith(
          TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.ADI2,
        );
      }));
      it('should dispatch the appropriate WaitingRoomToCarValidationError actions', fakeAsync(async () => {
        component.form = new FormGroup({
          requiredControl1: new FormControl(null, [Validators.required]),
          requiredControl2: new FormControl(null, [Validators.required]),
          notRequiredControl: new FormControl(null),
        });

        await component.onSubmit();
        tick();
        expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl1 is blank'));
        expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl2 is blank'));
        expect(store$.dispatch)
          .not
          .toHaveBeenCalledWith(WaitingRoomToCarValidationError('notRequiredControl is blank'));
      }));
    });
  });
});
