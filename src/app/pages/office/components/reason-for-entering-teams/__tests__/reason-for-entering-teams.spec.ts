import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ReasonForEnteringTeamsComponent } from '@pages/office/components/reason-for-entering-teams/reason-for-entering-teams';

describe('ReasonForEnteringTeamsComponent', () => {
  let fixture: ComponentFixture<ReasonForEnteringTeamsComponent>;
  let component: ReasonForEnteringTeamsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReasonForEnteringTeamsComponent],
    });

    fixture = TestBed.createComponent(ReasonForEnteringTeamsComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('ngOnChanges', () => {
    it('should initialize formControl if not already initialized', () => {
      component.formControl = null;
      component.ngOnChanges();
      expect(component.formControl).toBeTruthy();
    });

    it('should patch formControl value with reasonForOpeningTeams', () => {
      component.formControl = new UntypedFormControl('', [Validators.required]);
      component.reasonForOpeningTeams = 'Test Reason';
      component.ngOnChanges();
      expect(component.formControl.value).toBe('Test Reason');
    });

    it('should add formControl to formGroup if not already present', () => {
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      expect(component.formGroup.contains(component.fieldName)).toBeTrue();
    });

    it('should update formControl value if formGroup already contains fieldName', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({
        [component.fieldName]: new UntypedFormControl('Initial Value'),
      });
      component.ngOnChanges();
      expect(component.formControl.value).toEqual('Initial Value');
    });
  });

  describe('reasonForOpeningTeamsChanged', () => {
    it('should emit reasonForOpeningTeamsChange event with new reason', () => {
      spyOn(component.reasonForOpeningTeamsChange, 'emit');
      const newReason = 'New Reason';
      component.reasonForOpeningTeamsChanged(newReason);
      expect(component.reasonForOpeningTeamsChange.emit).toHaveBeenCalledWith(newReason);
    });
  });

  describe('invalid', () => {
    it('should return true if formControl is invalid and dirty', () => {
      component.formControl = new UntypedFormControl('', [Validators.required]);
      component.formControl.markAsDirty();
      expect(component.invalid).toBeTrue();
    });

    it('should return false if formControl is valid', () => {
      component.formControl = new UntypedFormControl('Valid Value', [Validators.required]);
      expect(component.invalid).toBeFalse();
    });

    it('should return false if formControl is not dirty', () => {
      component.formControl = new UntypedFormControl('', [Validators.required]);
      expect(component.invalid).toBeFalse();
    });
  });
});
