import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TellMeQuestionOutcomeComponent } from '../tell-me-question-outcome';

describe('TellMeQuestionOutcomeComponent', () => {
  let fixture: ComponentFixture<TellMeQuestionOutcomeComponent>;
  let component: TellMeQuestionOutcomeComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TellMeQuestionOutcomeComponent],
    });

    fixture = TestBed.createComponent(TellMeQuestionOutcomeComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  });

  describe('tellMeQuestionChanged', () => {
    it('should emit the correct event with the parameter given when form control is valid', () => {
      component.formControl = new UntypedFormControl(1, [Validators.required]);
      vi.spyOn(component.tellMeQuestionOutcomeChange, 'emit').mockReturnValue(undefined);
      component.tellMeQuestionOutcomeChanged('test');
      expect(component.tellMeQuestionOutcomeChange.emit).toHaveBeenCalledWith('test');
    });
    it('should emit nothing if form control is invalid', () => {
      vi.spyOn(component.tellMeQuestionOutcomeChange, 'emit').mockReturnValue(undefined);
      component.formControl = new UntypedFormControl(null, [Validators.required]);
      expect(component.tellMeQuestionOutcomeChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    it('should call tellMeQuestionOutcomeChanged  with P when Pass is pressed', () => {
      vi.spyOn(component, 'tellMeQuestionOutcomeChanged').mockReturnValue(undefined);
      component.ngOnChanges();
      component.tellMeQuestionSelected = true;
      fixture.detectChanges();
      const correctRadio = fixture.debugElement.query(By.css('#tellme-correct'));
      correctRadio.triggerEventHandler('change', { target: { value: 'P' } });
      fixture.detectChanges();
      expect(component.tellMeQuestionOutcomeChanged).toHaveBeenCalledWith('P');
    });
    it('should call tellMeQuestionOutcomeChanged with DF when Fail is pressed', () => {
      vi.spyOn(component, 'tellMeQuestionOutcomeChanged').mockReturnValue(undefined);
      component.ngOnChanges();
      component.tellMeQuestionSelected = true;
      fixture.detectChanges();
      const faultRadio = fixture.debugElement.query(By.css('#tellme-fault'));
      faultRadio.triggerEventHandler('change', { target: { value: 'DF' } });
      fixture.detectChanges();
      expect(component.tellMeQuestionOutcomeChanged).toHaveBeenCalledWith('DF');
    });
  });
});
