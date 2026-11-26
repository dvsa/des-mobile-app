import { Component, DebugElement, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { CharacterCountDirective } from '@directives/character-count.directive';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({ template: '<input type="text" charCount>', imports: [CharacterCountDirective] })
class TestCharCountComponent {}

@Component({
  imports: [ReactiveFormsModule, CharacterCountDirective],
  template: `
    <textarea [formControl]="control" charCount [charLimit]="limit" [hardLimit]="limit"></textarea>
  `,
})
class TestHardLimitComponent {
  control = new FormControl('');
  limit = 950;
}

class ElementRefMock extends ElementRef {
  nativeElement = {
    getAttribute(qualifiedName: string): string | null {
      return '10';
    },
  };
}

describe('Directive: CharacterCountDirective', () => {
  let fixture: ComponentFixture<TestCharCountComponent>;
  let directiveEl: DebugElement;
  let directiveInstance: CharacterCountDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestCharCountComponent, CharacterCountDirective],
      providers: [{ provide: ElementRef, useValue: ElementRefMock }],
    });
    fixture = TestBed.createComponent(TestCharCountComponent);
    fixture.detectChanges();
    directiveEl = fixture.debugElement.query(By.directive(CharacterCountDirective));
    directiveInstance = directiveEl.injector.get(CharacterCountDirective);
    vi.spyOn(directiveInstance.onCharacterCountChanged, 'emit').mockReturnValue(undefined);
  });
  it('should be created', () => {
    expect(directiveEl).not.toBeNull();
  });

  describe('ngAfterViewInit', () => {
    it('should emit onCharacterCountChanged if charLimit is true', () => {
      directiveInstance.charLimit = 3;
      directiveInstance.el.nativeElement.value = '11';
      directiveInstance.ngAfterViewInit();
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('onInput', () => {
    it('should call handleChange with the correct value', () => {
      vi.spyOn(directiveInstance, 'handleChange').mockReturnValue(undefined);
      directiveInstance.onInput({ target: { value: 'hello' } });
      expect(directiveInstance.handleChange).toHaveBeenCalledWith('hello');
    });

    it('does not truncate input when no hard limit is set', () => {
      directiveInstance.charLimit = 3;
      const input: HTMLInputElement = directiveEl.nativeElement;
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('hello');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(-2);
    });

    it('preserves multibyte input at the exact byte limit', () => {
      directiveInstance.charLimit = 3;
      directiveInstance.hardLimit = 3;
      const input: HTMLInputElement = directiveEl.nativeElement;
      input.value = 'aé';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('aé');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(0);
    });

    it('truncates ASCII input beyond the hard limit', () => {
      directiveInstance.charLimit = 3;
      directiveInstance.hardLimit = 3;
      const input: HTMLInputElement = directiveEl.nativeElement;
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('hel');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(0);
    });

    it('enforces the hard limit in bytes for multibyte input', () => {
      directiveInstance.charLimit = 3;
      directiveInstance.hardLimit = 3;
      const input: HTMLInputElement = directiveEl.nativeElement;
      input.value = 'aéé';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('aé');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(0);
    });

    it('does not split supplementary Unicode characters', () => {
      directiveInstance.charLimit = 2;
      directiveInstance.hardLimit = 2;
      const input: HTMLInputElement = directiveEl.nativeElement;
      input.value = 'a𐐷';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('a');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(1);
    });

    it('rejects input when the hard limit is zero', () => {
      directiveInstance.charLimit = 0;
      directiveInstance.hardLimit = 0;
      const input: HTMLInputElement = directiveEl.nativeElement;
      input.value = 'a';
      input.dispatchEvent(new Event('input'));

      expect(input.value).toBe('');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(0);
    });
  });

  describe('onIonChange', () => {
    it('should call handleChange with the correct value', () => {
      vi.spyOn(directiveInstance, 'handleChange').mockReturnValue(undefined);
      directiveInstance.onIonChange({ target: { value: 'hello' } });
      expect(directiveInstance.handleChange).toHaveBeenCalledWith('hello');
    });
  });

  describe('handleChange', () => {
    it('should emit remaining character count when charLimit is set and value is provided', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange('hello');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(5);
    });

    it('should not emit when charLimit is not set', () => {
      directiveInstance.charLimit = null;
      directiveInstance.handleChange('hello');
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });

    it('should not emit when value is undefined', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange(undefined);
      expect(directiveInstance.onCharacterCountChanged.emit).not.toHaveBeenCalled();
    });

    it('should emit remaining character count when input is empty string', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange('');
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(10);
    });

    it('should emit remaining character count when input is null', () => {
      directiveInstance.charLimit = 10;
      directiveInstance.handleChange(null);
      expect(directiveInstance.onCharacterCountChanged.emit).toHaveBeenCalledWith(10);
    });
  });

  describe('getUtf8ByteLength', () => {
    it('should return correct byte length for ASCII characters', () => {
      const result = directiveInstance.getUtf8ByteLength('hello');
      expect(result).toBe(5);
    });

    it('should return correct byte length for multi-byte characters', () => {
      const result = directiveInstance.getUtf8ByteLength('你好');
      expect(result).toBe(6);
    });

    it('should return 0 for an empty string', () => {
      const result = directiveInstance.getUtf8ByteLength('');
      expect(result).toBe(0);
    });

    it('should return correct byte length for mixed characters', () => {
      const result = directiveInstance.getUtf8ByteLength('hello你好');
      expect(result).toBe(11);
    });

    it('returns correct byte length for special characters', () => {
      const result = directiveInstance.getUtf8ByteLength('!@#$%^&*()');
      expect(result).toBe(10);
    });
  });

  describe('CharacterCountDirective hard limit with reactive forms', () => {
    it('keeps the form value within 950 UTF-8 bytes after typing a multibyte character', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.value = `${'a'.repeat(949)}é`;
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.value).toBe('a'.repeat(949));
      expect(fixture.componentInstance.control.value).toBe(input.value);
      expect(new TextEncoder().encode(fixture.componentInstance.control.value).length).toBeLessThanOrEqual(950);
    });

    it('keeps the form value in sync when ASCII input is truncated', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      fixture.componentInstance.limit = 3;
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.value = 'hello';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.value).toBe('hel');
      expect(fixture.componentInstance.control.value).toBe('hel');
    });

    it('preserves selected text when an insertion in the middle cannot fit', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      fixture.componentInstance.limit = 4;
      fixture.componentInstance.control.setValue('abXY');
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.setSelectionRange(1, 2);
      input.dispatchEvent(new Event('beforeinput', { bubbles: true }));
      input.value = 'aéXY';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.value).toBe('abXY');
      expect([input.selectionStart, input.selectionEnd]).toEqual([1, 2]);
      expect(fixture.componentInstance.control.value).toBe('abXY');
    });

    it('enforces the limit after composition and synchronises the form', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      fixture.componentInstance.limit = 3;
      fixture.componentInstance.control.setValue('ab');
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.setSelectionRange(2, 2);
      input.dispatchEvent(new Event('compositionstart', { bubbles: true }));
      input.value = 'abé';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('compositionend', { bubbles: true }));

      expect(input.value).toBe('ab');
      expect(fixture.componentInstance.control.value).toBe('ab');
    });

    it('preserves an over-limit value and selection through the final composition input', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      const original = `${'a'.repeat(950)}Z`;
      fixture.componentInstance.control.setValue(original);
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.setSelectionRange(0, 1);
      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      input.value = `é${original.slice(1)}`;
      input.dispatchEvent(new InputEvent('input', { bubbles: true, isComposing: true }));
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'é' }));

      expect(input.value).toBe(original);
      expect([input.selectionStart, input.selectionEnd]).toEqual([0, 1]);
      input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertCompositionText', data: 'é' }));

      expect(input.value).toBe(original);
      expect([input.selectionStart, input.selectionEnd]).toEqual([0, 1]);
      expect(fixture.componentInstance.control.value).toBe(original);
    });

    it('retains the composition snapshot through a final composition beforeinput', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      const original = `${'a'.repeat(950)}Z`;
      fixture.componentInstance.control.setValue(original);
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.setSelectionRange(0, 1);
      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      input.value = `é${original.slice(1)}`;
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true, data: 'é' }));
      input.dispatchEvent(
        new InputEvent('beforeinput', { bubbles: true, inputType: 'insertFromComposition', data: 'é' })
      );
      input.value = `é${original.slice(1)}`;
      input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertFromComposition', data: 'é' }));

      expect(input.value).toBe(original);
      expect([input.selectionStart, input.selectionEnd]).toEqual([0, 1]);
      expect(fixture.componentInstance.control.value).toBe(original);
    });

    it('uses a fresh selection for the next edit if composition has no final input', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      fixture.componentInstance.limit = 4;
      fixture.componentInstance.control.setValue('abXY');
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.setSelectionRange(1, 2);
      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      input.value = 'aéXY';
      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
      input.setSelectionRange(3, 4);
      input.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertText', data: 'é' }));
      input.value = 'abXé';
      input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'é' }));

      expect(input.value).toBe('abXY');
      expect([input.selectionStart, input.selectionEnd]).toEqual([3, 4]);
      expect(fixture.componentInstance.control.value).toBe('abXY');
    });

    it('allows an over-limit value to be reduced without discarding its remainder', () => {
      const fixture = TestBed.createComponent(TestHardLimitComponent);
      fixture.componentInstance.limit = 3;
      fixture.componentInstance.control.setValue('ééé');
      fixture.detectChanges();
      const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
      input.dispatchEvent(new Event('beforeinput', { bubbles: true }));
      input.value = 'éé';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.value).toBe('éé');
      expect(fixture.componentInstance.control.value).toBe('éé');
    });
  });
});
