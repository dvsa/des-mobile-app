import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators,
} from '@angular/forms';
import {
  ModeOfTransportCatAMod2Component,
} from '@pages/office/cat-a-mod2/components/mode-of-transport/mode-of-transport.cat-a-mod2';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

describe('ModeOfTransportCatAMod2Component', () => {
  let fixture: ComponentFixture<ModeOfTransportCatAMod2Component>;
  let component: ModeOfTransportCatAMod2Component;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModeOfTransportCatAMod2Component],
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(ModeOfTransportCatAMod2Component);
    component = fixture.componentInstance;
  }));

  describe('modeOfTransportChanged', () => {
    it('should emit independentDriving while from control is valid', () => {
      spyOn(component.modeOfTransportChange, 'emit');
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.modeOfTransportChanged('Car to bike');
      expect(component.modeOfTransportChange.emit).toHaveBeenCalledWith('Car to bike');
    });
    it('should not emit independentDriving while from control is not valid', () => {
      spyOn(component.modeOfTransportChange, 'emit');
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.modeOfTransportChanged('Car to bike');
      expect(component.modeOfTransportChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });

  describe('ngOnChanges', () => {
    it('should clear validators from FormControl if visibilityType is VisibilityType.NotVisible', () => {
      component.formControl = new UntypedFormControl();
      component.formGroup = new UntypedFormGroup({});
      component.formGroup.addControl('modeOfTransport', component.formControl);
      component.formGroup.get('modeOfTransport').setValidators([Validators.required]);

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.NotVisible);
      component.ngOnChanges();

      expect(component.formGroup.get('modeOfTransport')
        .hasValidator(Validators.required)).toBe(false);
    });
    it('should set validators to FormControl if visibilityType is not VisibilityType.NotVisible', () => {
      component.formGroup = new UntypedFormGroup({});

      spyOn(component.outcomeBehaviourProvider, 'getVisibilityType').and.returnValue(VisibilityType.Visible);
      component.ngOnChanges();

      expect(component.formGroup.get('modeOfTransport')
        .hasValidator(Validators.required)).toBe(true);
    });
  });

  describe('getModeOfTransportInputId', () => {
    it('should return "mode-of-transport-test" after removing non alphaNum and setting to lowercase', () => {
      expect(component.getModeOfTransportInputId('##T##E##S##T')).toBe('mode-of-transport-test');
    });
  });
});
