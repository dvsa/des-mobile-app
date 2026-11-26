import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ReviewFeedback } from '@pages/test-report-dashboard/components/review-feedback/review-feedback';
import { CharacterCountService } from '@providers/character-count/character-count.service';

describe('ReviewFeedback', () => {
  let characterCountService: CharacterCountService;
  let fixture: ComponentFixture<ReviewFeedback>;
  let component: ReviewFeedback;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReviewFeedback],
      providers: [{ provide: CharacterCountService, useClass: CharacterCountService }],
    });

    fixture = TestBed.createComponent(ReviewFeedback);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({});
    characterCountService = TestBed.inject(CharacterCountService);
  });

  it('limits pasted feedback to the configured UTF-8 byte limit', async () => {
    fixture.componentRef.setInput('form', component.form);
    fixture.componentRef.setInput('feedback', 'ab');
    fixture.componentRef.setInput('feedbackCharLimit', 4);
    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    textarea.setSelectionRange(2, 2);
    const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => 'éé' } });
    textarea.dispatchEvent(event);
    textarea.dispatchEvent(new Event('blur'));
    await fixture.whenStable();

    expect(textarea.value).toBe('abé');
    expect(component.formControl.value).toBe('abé');
    expect(component.charsRemaining).toBe(0);
    expect(component.formControl.valid).toBe(true);
  });

  it('limits paste in the middle without removing surrounding text', async () => {
    fixture.componentRef.setInput('form', component.form);
    fixture.componentRef.setInput('feedback', 'abXY');
    fixture.componentRef.setInput('feedbackCharLimit', 6);
    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    textarea.setSelectionRange(1, 2);
    const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => 'éé' } });
    textarea.dispatchEvent(event);
    await fixture.whenStable();

    expect(textarea.value).toBe('aéXY');
    expect(textarea.selectionStart).toBe(2);
    expect(component.formControl.value).toBe('aéXY');
    expect(component.charsRemaining).toBe(1);
  });

  describe('feedbackChanged', () => {
    it('should emit getCharacterCountText with correct parameters', () => {
      vi.spyOn(component.feedbackChange, 'emit').mockReturnValue(undefined);
      component.feedbackChanged('feedback');
      expect(component.feedbackChange.emit).toHaveBeenCalledWith('feedback');
    });
  });

  describe('getCharacterCountText', () => {
    it('should call service with charsRemaining', () => {
      vi.spyOn(characterCountService, 'getCharacterCountText').mockReturnValue(undefined);
      component.charsRemaining = 1;
      component.getCharacterCountText();

      expect(characterCountService.getCharacterCountText).toHaveBeenCalledWith(component.charsRemaining);
    });
  });

  describe('characterCountChanged', () => {
    it('should change feedbackCharsRemaining to the parameter passed in', () => {
      component.formControl = new FormControl();
      component.characterCountChanged(1);
      expect(component.charsRemaining).toBe(1);
    });
    it('should check the validity of the form control', () => {
      component.formControl = new FormControl();
      vi.spyOn(component.formControl, 'updateValueAndValidity').mockReturnValue(undefined);
      component.characterCountChanged(1);
      expect(component.formControl.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});
