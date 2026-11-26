import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

@Component({
  imports: [ReactiveFormsModule, PasteSanitiserDirective],
  template: `
    <textarea [formControl]="text" [maxlength]="limit" pasteSanitiser></textarea>
    <input [formControl]="unlimited" pasteSanitiser>
    <input [formControl]="digits" numbersOnly pasteSanitiser>
    <input type="number" [formControl]="number" numbersOnly pasteSanitiser>
  `,
})
class TestPasteComponent {
  text = new FormControl('abXY');
  unlimited = new FormControl('hello');
  digits = new FormControl('12');
  number = new FormControl(12);
  limit = 6;
}

describe('PasteSanitiserDirective', () => {
  let fixture: ComponentFixture<TestPasteComponent>;
  let component: TestPasteComponent;
  let textarea: HTMLTextAreaElement;
  let unlimited: HTMLInputElement;
  let digits: HTMLInputElement;
  let number: HTMLInputElement;

  function paste(element: HTMLElement, value: string): Event {
    const event = new Event('paste', { bubbles: true, cancelable: true, composed: true });
    Object.defineProperty(event, 'clipboardData', { value: { getData: () => value } });
    element.dispatchEvent(event);
    return event;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestPasteComponent] });
    fixture = TestBed.createComponent(TestPasteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    textarea = fixture.nativeElement.querySelector('textarea');
    [unlimited, digits, number] = fixture.nativeElement.querySelectorAll('input');
  });

  describe('text insertion', () => {
    it('replaces only the selected text and updates the form and caret', () => {
      textarea.setSelectionRange(1, 2);
      const event = paste(textarea, '12');

      expect(event.defaultPrevented).toBe(true);
      expect(textarea.value).toBe('a12XY');
      expect(textarea.selectionStart).toBe(3);
      expect(textarea.selectionEnd).toBe(3);
      expect(component.text.value).toBe('a12XY');
      expect(component.text.dirty).toBe(true);
    });

    it('inserts at the caret without changing surrounding text', () => {
      unlimited.setSelectionRange(2, 2);
      paste(unlimited, 'XYZ');

      expect(unlimited.value).toBe('heXYZllo');
      expect(component.unlimited.value).toBe('heXYZllo');
    });

    it('removes emoji from the clipboard text before insertion', () => {
      unlimited.setSelectionRange(0, 5);
      paste(unlimited, 'Hi 😊 there');

      expect(unlimited.value).toBe('Hi  there');
      expect(component.unlimited.value).toBe('Hi  there');
    });

    it('normalises line endings in textareas and removes them from inputs', () => {
      textarea.setSelectionRange(0, 4);
      unlimited.setSelectionRange(0, 5);
      paste(textarea, 'a\r\nb\rc');
      paste(unlimited, 'a\r\nb\rc');

      expect(textarea.value).toBe('a\nb\nc');
      expect(unlimited.value).toBe('abc');
    });

    it('leaves the selection and form pristine when sanitisation removes the paste', () => {
      textarea.setSelectionRange(0, 2);
      paste(textarea, '😊');

      expect(textarea.value).toBe('abXY');
      expect(textarea.selectionStart).toBe(0);
      expect(textarea.selectionEnd).toBe(2);
      expect(component.text.pristine).toBe(true);
    });
  });

  describe('maxlength', () => {
    it('counts UTF-8 bytes including text outside the selection', () => {
      textarea.setSelectionRange(1, 2);
      paste(textarea, 'éé');

      expect(textarea.value).toBe('aéXY');
      expect(new TextEncoder().encode(textarea.value).length).toBe(5);
      expect(component.text.value).toBe('aéXY');
    });

    it('does not split supplementary Unicode characters', () => {
      textarea.setSelectionRange(0, 4);
      paste(textarea, '𐐷𐐷');

      expect(textarea.value).toBe('𐐷');
      expect(new TextEncoder().encode(textarea.value).length).toBe(4);
    });

    it('uses the latest bound maxlength including zero', () => {
      component.limit = 0;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      textarea.setSelectionRange(0, 4);
      paste(textarea, 'a');

      expect(textarea.value).toBe('abXY');
      expect(component.text.pristine).toBe(true);
    });

    it('does not truncate input without maxlength', () => {
      unlimited.setSelectionRange(0, 5);
      paste(unlimited, 'é'.repeat(100));

      expect(unlimited.value).toBe('é'.repeat(100));
    });
  });

  describe('numeric fields', () => {
    it('removes non-digits from numbersOnly paste', () => {
      digits.setSelectionRange(1, 1);
      paste(digits, 'a3.4😊');

      expect(digits.value).toBe('1342');
      expect(component.digits.value).toBe('1342');
    });

    it('replaces the full value of number inputs, which do not support selection', () => {
      paste(number, '03a45');

      expect(number.value).toBe('0345');
      expect(component.number.value).toBe(345);
    });
  });

  describe('change notifications', () => {
    it('dispatches change on blur after a programmatic paste', () => {
      const change = vi.fn();
      textarea.addEventListener('change', change);
      textarea.setSelectionRange(0, 4);
      paste(textarea, 'hello');
      textarea.dispatchEvent(new Event('blur'));
      textarea.dispatchEvent(new Event('blur'));

      expect(change).toHaveBeenCalledOnce();
    });

    it('does not dispatch another change if one has already occurred', () => {
      const change = vi.fn();
      textarea.addEventListener('change', change);
      textarea.setSelectionRange(0, 4);
      paste(textarea, 'hello');
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.dispatchEvent(new Event('blur'));

      expect(change).toHaveBeenCalledOnce();
    });

    it('does not notify input or change listeners when the value is unchanged', () => {
      const onInput = vi.fn();
      const onChange = vi.fn();
      textarea.addEventListener('input', onInput);
      textarea.addEventListener('change', onChange);
      textarea.setSelectionRange(0, 4);
      paste(textarea, 'abXY');
      textarea.dispatchEvent(new Event('blur'));

      expect(onInput).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it('blocks paste and warns when clipboard data is unavailable', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const event = new Event('paste', { bubbles: true, cancelable: true });
    unlimited.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(unlimited.value).toBe('hello');
    expect(warning).toHaveBeenCalledWith('Unable to sanitise paste: input or clipboard data is unavailable.');
  });

  it('blocks paste and warns when no native input is in the event path', () => {
    const host = document.createElement('div');
    const directive = new PasteSanitiserDirective(new ElementRef(host));
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    host.addEventListener('paste', (event) => directive.onInput(event as ClipboardEvent));
    const event = paste(host, 'hello');

    expect(event.defaultPrevented).toBe(true);
    expect(warning).toHaveBeenCalledWith('Unable to sanitise paste: input or clipboard data is unavailable.');
  });
});
