import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonRow, IonSelect, IonSelectOption } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { VehicleChecksToggleComponent } from '../vehicle-checks-completed';

describe('VehicleChecksToggleComponent', () => {
  let fixture: ComponentFixture<VehicleChecksToggleComponent>;
  let component: VehicleChecksToggleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleChecksToggleComponent],
      imports: [ReactiveFormsModule, IonCol, IonRow, IonSelect, IonSelectOption],
      providers: [
        provideMockStore({
          initialState: {
            tests: {
              currentTest: { slotId: '123' },
              startedTests: {
                123: {
                  testData: {
                    vehicleChecks: {
                      fullLicenceHeld: false,
                      showMeQuestions: [],
                      tellMeQuestions: [],
                    },
                  },
                },
              },
              testStatus: {},
            },
          },
        }),
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksToggleComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.ngOnChanges();
    component.ngOnInit();
  });

  describe('DOM', () => {
    it('should call VehicleChecksToggleResultChanged with Completed when selected', () => {
      spyOn(component, 'vehicleChecksToggleResultChanged');
      component.testCategory = TestCategory.BE;
      fixture.detectChanges();
      const vehicleChecksCompletedRadio = fixture.debugElement.query(By.css('#vehicle-checks-toggle-completed'));
      vehicleChecksCompletedRadio.triggerEventHandler('change', { target: { value: 'Completed' } });

      fixture.detectChanges();
      expect(component.vehicleChecksToggleResultChanged).toHaveBeenCalledWith('Completed');
    });
    it('should call VehicleChecksToggleResultChanged with Not completed when not selected', () => {
      spyOn(component, 'vehicleChecksToggleResultChanged');
      component.testCategory = TestCategory.BE;
      fixture.detectChanges();
      const vehicleChecksCompletedRadio = fixture.debugElement.query(By.css('#vehicle-checks-toggle-non-completed'));

      vehicleChecksCompletedRadio.triggerEventHandler('change', { target: { value: 'Not completed' } });
      fixture.detectChanges();
      expect(component.vehicleChecksToggleResultChanged).toHaveBeenCalledWith('Not completed');
    });
  });
  describe('vehicleChecksToggleResultChanged', () => {
    it('should output true if result is set to "Completed" and formControl is valid', () => {
      component.formControl = new UntypedFormControl(1);
      spyOn(component.vehicleChecksCompletedOutcomeChange, 'emit');
      component.vehicleChecksToggleResultChanged('Completed');
      expect(component.vehicleChecksCompletedOutcomeChange.emit).toHaveBeenCalledWith(true);
    });
    it('should output false if result is not set to "Completed" and formControl is valid', () => {
      component.formControl = new UntypedFormControl(1);
      spyOn(component.vehicleChecksCompletedOutcomeChange, 'emit');
      component.vehicleChecksToggleResultChanged('Not completed');
      expect(component.vehicleChecksCompletedOutcomeChange.emit).toHaveBeenCalledWith(false);
    });
  });
});
