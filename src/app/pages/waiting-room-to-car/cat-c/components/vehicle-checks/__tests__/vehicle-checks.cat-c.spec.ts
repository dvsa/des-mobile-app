import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  IonicModule, ModalController, Config, NavParams,
} from '@ionic/angular';
import { ModalControllerMock, ConfigMock, NavParamsMock } from 'ionic-mocks';
import { CAT_C } from '@pages/page-names.constants';
import { AppComponent } from '@app/app.component';
import { Store, StoreModule } from '@ngrx/store';
import { MockAppComponent } from '@app/__mocks__/app.component.mock';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { testsReducer } from '@store/tests/tests.reducer';
import { StartTest } from '@store/tests/tests.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { StoreModel } from '@shared/models/store.model';
import { configureTestSuite } from 'ng-bullet';
import { VehicleChecksCatCComponent } from '../vehicle-checks.cat-c';

describe('VehicleChecksCatCComponent', () => {
  let fixture: ComponentFixture<VehicleChecksCatCComponent>;
  let component: VehicleChecksCatCComponent;
  let modalController: ModalController;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatCComponent,
        SeriousFaultBadgeComponent,
        DrivingFaultsBadgeComponent,
        TickIndicatorComponent,
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: AppComponent, useClass: MockAppComponent },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        Store,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksCatCComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
  }));

  describe('Class', () => {
    describe('openVehicleChecksModal', () => {
      it('should create the correct model', () => {
        component.category = TestCategory.C1E;
        component.openVehicleChecksModal();
        expect(modalController.create).toHaveBeenCalledTimes(1);
        expect(modalController.create).toHaveBeenCalledWith(
          CAT_C.VEHICLE_CHECKS_MODAL,
          { category: TestCategory.C1E },
          { cssClass: 'modal-fullscreen text-zoom-regular' },
        );
      });
    });

    describe('hasSeriousFault', () => {
      it('should return true if vehicle checks score has serious fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 1,
          drivingFaults: 4,
        };
        expect(component.hasSeriousFault()).toBeTruthy();
      });

      it('should return false if vehicle checks score does not have serious fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 3,
        };
        expect(component.hasSeriousFault()).toBeFalsy();
      });
    });

    describe('hasDrivingFault', () => {
      it('should return true if vehicle checks score has driving fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 1,
        };
        expect(component.hasDrivingFault()).toBeTruthy();
      });

      it('should return false if vehicle checks score does not have driving fault', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecksScore = {
          seriousFaults: 0,
          drivingFaults: 0,
        };
        expect(component.hasDrivingFault()).toBeFalsy();
      });
    });

    describe('everyQuestionHasOutcome', () => {
      it('should return false when not all show me and tell me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{}, {}, {}],
          tellMeQuestions: [{}, {}],
        };
        expect(component.everyQuestionHasOutcome()).toBeFalsy();
      });

      it('should return false when not all show me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{}, {}, {}],
          tellMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }],
        };
        expect(component.everyQuestionHasOutcome()).toBeFalsy();
      });

      it('should return false when not all tell me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }, { outcome: 'P' }],
          tellMeQuestions: [{}, {}],
        };
        expect(component.everyQuestionHasOutcome()).toBeFalsy();
      });

      it('should return true when all show / tell me questions have outcome', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        component.vehicleChecks = {
          showMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }, { outcome: 'P' }],
          tellMeQuestions: [{ outcome: 'P' }, { outcome: 'DF' }],
        };
        expect(component.everyQuestionHasOutcome()).toBeTruthy();
      });
    });

    describe('incompleteVehicleChecks', () => {
      it('should return vehicle checks as false', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        const result = component.incompleteVehicleChecks();
        expect(result).toEqual({ vehicleChecks: false });
      });
    });

    describe('validateVehicleChecks', () => {
      it('should call incompleteVehicleChecks() if all questions have NOT been answered', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(false);
        spyOn(component, 'incompleteVehicleChecks');
        component.validateVehicleChecks();
        expect(component.incompleteVehicleChecks).toHaveBeenCalled();
      });

      it('should return null if all questions have been answered', () => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        spyOn(component, 'incompleteVehicleChecks');
        const result = component.validateVehicleChecks();
        expect(result).toEqual(null);
      });
    });

    describe('invalid', () => {
      beforeEach(() => {
        store$.dispatch(StartTest(12345, TestCategory.C));
        const formBuilder: FormBuilder = new FormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        component.formControl = formBuilder.control({});
      });

      describe('when form is dirty', () => {
        it('should return TRUE if the form control is invalid', () => {
          component.formControl.markAsDirty();
          component.formControl.setErrors({ vehicleChecks: false });
          const result = component.invalid;
          expect(result).toEqual(true);
        });

        it('should return FALSE if the form control is valid', () => {
          component.formControl.markAsDirty();
          const result = component.invalid;
          expect(result).toEqual(false);
        });
      });

      describe('when form is NOT dirty', () => {
        it('should return FALSE if the form control is invalid', () => {
          component.formControl.markAsPristine();
          const result = component.invalid;
          expect(result).toEqual(false);
        });
      });
    });

    describe('ngOnChanges', () => {
      it('should add the form control', () => {
        const formBuilder: FormBuilder = new FormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        component.ngOnChanges();
        const result = component.formGroup.contains('vehicleChecksSelectQuestions');
        expect(result).toEqual(true);
      });

      it('should validate the vehicle checks', () => {
        const formBuilder: FormBuilder = new FormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        spyOn(component, 'everyQuestionHasOutcome').and.returnValue(true);
        spyOn(component, 'validateVehicleChecks');
        component.ngOnChanges();
        expect(component.validateVehicleChecks).toHaveBeenCalled();
      });

      it('should patch the form control value', () => {
        const formBuilder: FormBuilder = new FormBuilder();
        component.formGroup = formBuilder.group({
          vehicleChecksSelectQuestions: null,
        });
        component.formControl = formBuilder.control({});
        component.ngOnChanges();
        expect(component.formControl.value).toEqual('Select questions');
      });
    });
  });
});
