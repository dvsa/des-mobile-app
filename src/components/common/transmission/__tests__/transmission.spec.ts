import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransmissionComponent } from '../transmission';

describe('TransmissionComponent', () => {
  let fixture: ComponentFixture<TransmissionComponent>;
  let component: TransmissionComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransmissionComponent],
      imports: [IonicModule, ReactiveFormsModule],
    });

    fixture = TestBed.createComponent(TransmissionComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('ngOnChanges', () => {
    it('creates automatic confirm control when confirmation settings enabled and transmission is Automatic', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.autoConfirmSelected = true;
      spyOn(component.automaticConfirmChange, 'emit');
      component.ngOnChanges();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName);
      expect(ctrl).toBeTruthy();
      expect(component.autoCheckboxFormControl).toBeTruthy();
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(component.autoConfirmSelected);
    });

    it('does not create automatic confirm control when confirmation settings disabled', () => {
      component.shouldShowConfirmationSettings = false;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.ngOnChanges();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName);
      expect(ctrl).toBeNull();
      expect(component.autoCheckboxFormControl).toBeUndefined();
    });
  });

  describe('transmissionChanged', () => {
    it('removes automatic confirm control and emits undefined when transmission changed to Manual', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.ngOnChanges();
      spyOn(component.automaticConfirmChange, 'emit');
      component.transmissionChanged('Manual');
      expect(component.formGroup.get(component.autoConfirmFieldName)).toBeNull();
      expect(component.autoCheckboxFormControl).toBeNull();
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('deactivateEditMode', () => {
    it('deactivateEditMode unchecks the checkbox control, updates state and emits false', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.autoConfirmSelected = true;
      component.ngOnChanges();
      spyOn(component.automaticConfirmChange, 'emit');
      component.deactivateEditMode();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName) as UntypedFormControl;
      expect(component.autoConfirmSelected).toBeFalse();
      expect(ctrl.value).toBeFalse();
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('automaticConfirmChanged', () => {
    it('automaticConfirmChanged sets isShowingEditBox to false and emits provided value', () => {
      spyOn(component.automaticConfirmChange, 'emit');
      component.isShowingEditBox = true;
      component.automaticConfirmChanged(true);
      expect(component.isShowingEditBox).toBeFalse();
      expect(component.automaticConfirmChange.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('isAutoConfirmInvalid', () => {
    it('returns false when control is not present', () => {
      component.autoCheckboxFormControl = null;
      expect(component.isAutoConfirmInvalid()).toBeFalse();
    });

    it('returns true when control is invalid and dirty', () => {
      component.shouldShowConfirmationSettings = true;
      component.transmission = 'Automatic';
      component.shouldShowEditBox = false;
      component.autoConfirmSelected = false;
      component.ngOnChanges();
      const ctrl = component.formGroup.get(component.autoConfirmFieldName) as UntypedFormControl;
      ctrl.markAsDirty();
      expect(component.isAutoConfirmInvalid()).toBeTrue();
    });
  });
});
