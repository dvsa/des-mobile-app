import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CharacterCountDirective } from '@directives/character-count.directive';

import { CharacterCountService } from '@providers/character-count/character-count.service';
import { MockDirective } from 'ng-mocks';
import { OtherReasonComponent } from '../other-reason';

describe('OtherReasonComponent', () => {
  let characterCountService: CharacterCountService;
  let fixture: ComponentFixture<OtherReasonComponent>;
  let component: OtherReasonComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, OtherReasonComponent, MockDirective(CharacterCountDirective)],
      providers: [{ providers: CharacterCountService, useValue: CharacterCountService }],
    });

    fixture = TestBed.createComponent(OtherReasonComponent);
    characterCountService = TestBed.inject(CharacterCountService);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.ngOnChanges();
  });

  describe('class', () => {
    describe('ngOnChanges', () => {
      it('should add the form controls for the checkbox and textarea', () => {
        expect(component.formGroup.get('otherSelected')).not.toBeNull();
        expect(component.formGroup.get('reason')).not.toBeNull();
      });
    });

    describe('selectedValueChanged', () => {
      it('should emit when reason is selected', () => {
        vi.spyOn(component.selectedChange, 'emit').mockReturnValue(undefined);
        component.selectedValueChanged(true);
        expect(component.selectedChange.emit).toHaveBeenCalledWith(true);
      });
      it('should reset the field when unselecting the checkbox', () => {
        const field = component.formGroup.get('reason');
        vi.spyOn(field, 'reset').mockReturnValue(undefined);
        component.selectedValueChanged(false);
        expect(field.reset).toHaveBeenCalled();
      });
    });

    describe('reasonTextChanged', () => {
      it('should emit the reason', () => {
        vi.spyOn(component.reasonChange, 'emit').mockReturnValue(undefined);
        const reasonText = 'reason for change';
        component.reasonTextChanged(reasonText);
        expect(component.reasonChange.emit).toHaveBeenCalledWith(reasonText);
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

    describe('charactersExceeded', () => {
      it('should call service with charsRemaining', () => {
        vi.spyOn(characterCountService, 'charactersExceeded').mockReturnValue(undefined);
        component.charsRemaining = 1;
        component.charactersExceeded();

        expect(characterCountService.charactersExceeded).toHaveBeenCalledWith(component.charsRemaining);
      });
    });
  });

  describe('DOM', () => {
    it('should show the reason textbox when selected', () => {
      component.selected = true;
      fixture.detectChanges();
      const textbox = fixture.debugElement.query(By.css('textarea'));
      expect(textbox).toBeDefined();
    });

    it('should not show the reason textbox when not selected', () => {
      component.selected = false;
      fixture.detectChanges();
      const textbox = fixture.debugElement.query(By.css('textarea'));
      expect(textbox).toBeNull();
    });

    it('should not show validation bar or message initially', () => {
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeNull();
      expect(validationMessage).toBeNull();
    });

    it('should show the validation bar and character count validation text when clearing the reason', () => {
      component.selected = true;
      fixture.detectChanges();
      const field = fixture.debugElement.query(By.css('#otherReason'));
      field.triggerEventHandler('change', { target: { value: 'Reason text' } });
      fixture.detectChanges();
      field.triggerEventHandler('change', { target: { value: '' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeDefined();
      expect(validationMessage).toBeDefined();
    });

    it('should not show the validation bar or message after entering a reason', () => {
      component.selected = true;
      fixture.detectChanges();
      const field = fixture.debugElement.query(By.css('#otherReason'));
      field.triggerEventHandler('change', { target: { value: 'Reason text' } });
      fixture.detectChanges();
      const validationBar = fixture.debugElement.query(By.css('.validation-bar.invalid'));
      const validationMessage = fixture.debugElement.query(By.css('.validation-message-row'));
      expect(validationBar).toBeNull();
      expect(validationMessage).toBeNull();
    });
  });
});
