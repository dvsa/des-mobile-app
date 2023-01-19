import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import { ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';

describe('TrueLikenessComponent', () => {
  let fixture: ComponentFixture<TrueLikenessComponent>;
  let component: TrueLikenessComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [TrueLikenessComponent],
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(TrueLikenessComponent);
    component = fixture.componentInstance;
  }));

  describe('onChanges', () => {
    it('should patch trueLikeness into formControl if it is true', () => {
      component.trueLikeness = true;
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();
      expect(component.formControl.value).toBe('true');
    });
    it('should patch trueLikeness into formControl if it is false', () => {
      component.trueLikeness = false;
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();
      expect(component.formControl.value).toBe('false');
    });
    it('should patch trueLikeness into formControl if it is neither true nor false', () => {
      component.trueLikeness = null;
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();
      expect(component.formControl.value).toBe(null);
    });
  });

  describe('trueLikenessChanged', () => {
    it('should emit trueLikeness while from control is valid', () => {
      spyOn(component.trueLikenessChange, 'emit');
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.trueLikenessChanged('true');
      expect(component.trueLikenessChange.emit).toHaveBeenCalledWith(true);
    });
    it('should not emit trueLikeness while from control is not valid', () => {
      spyOn(component.trueLikenessChange, 'emit');
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.trueLikenessChanged('true');
      expect(component.trueLikenessChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});
