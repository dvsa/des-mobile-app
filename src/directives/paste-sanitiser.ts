import { Directive, ElementRef, HostListener } from '@angular/core';
import emojiRegex from 'emoji-regex';

// Attach the sanitiser to fields with the pasteSanitiser attribute.
@Directive({ selector: '[pasteSanitiser]' })
export class PasteSanitiserDirective {
  // Match emoji before inserting clipboard text into the field.
  emojiPattern = emojiRegex();
  // Native fields that save on change need a blur fallback after programmatic insertion.
  private pasteNeedsChange = false;

  // Keep the host element for its sanitisation options and change notifications.
  constructor(private el: ElementRef<HTMLElement>) {}

  // Handle clipboard data before the browser inserts it.
  @HostListener('paste', ['$event'])
  onInput(event: ClipboardEvent): void {
    // Cancel the browser's insertion so unsanitised text is never shown or propagated.
    event.preventDefault();

    // Ionic controls wrap their native input; composedPath exposes it during the event.
    const inputField = event
      .composedPath()
      .find(
        (element): element is HTMLInputElement | HTMLTextAreaElement =>
          element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      );
    // Report and block the paste if the target or clipboard data is unavailable.
    if (!inputField || !event.clipboardData) {
      console.warn('Unable to sanitise paste: input or clipboard data is unavailable.');
      return;
    }

    // Only the clipboard text is filtered; existing, unselected text is retained.
    let pasted = event.clipboardData.getData('text/plain').replace(this.emojiPattern, '');
    // Numeric-only fields can opt into retaining decimal points.
    if (this.el.nativeElement.hasAttribute('numbersOnly')) {
      pasted = pasted.replace(/\D/g, '');
    }
    // Match browser newline handling for textareas and single-line inputs.
    pasted = inputField instanceof HTMLTextAreaElement ? pasted.replace(/\r\n?/g, '\n') : pasted.replace(/[\r\n]/g, '');

    // Number and other non-selectable inputs do not expose a caret or selection.
    const hasSelection = inputField.selectionStart !== null && inputField.selectionEnd !== null;
    const start = inputField.selectionStart ?? 0;
    const end = inputField.selectionEnd ?? inputField.value.length;
    const before = inputField.value.slice(0, start);
    const after = inputField.value.slice(end);

    // A missing maxlength means no limit; otherwise interpret it as UTF-8 bytes.
    const maxLength = inputField.maxLength;
    const encoder = new TextEncoder();
    let accepted = '';
    for (const character of pasted) {
      // Iterate by Unicode code point and include both sides of the selection.
      if (maxLength >= 0 && encoder.encode(before + accepted + character + after).length > maxLength) break;
      accepted += character;
    }

    // Do not delete the selection if nothing survives sanitisation or fits the limit.
    if (!accepted) return;

    // Replace the selected range, or the whole value when selection is unsupported.
    const previousValue = inputField.value;
    if (!hasSelection) {
      inputField.value = accepted;
      // Some input types reject values assigned programmatically; restore the original.
      if (!inputField.value) {
        inputField.value = previousValue;
        console.warn('Unable to paste the sanitised value into this input type.');
        return;
      }
    } else {
      // Leave the caret immediately after the inserted text.
      inputField.setRangeText(accepted, start, end, 'end');
    }
    // Avoid notifying listeners when the field's value did not change.
    if (inputField.value === previousValue) return;

    // Ionic generates ionInput and ionChange from its native input's events;
    // native fields need a fallback change event on blur for paste-only edits.
    if (inputField === this.el.nativeElement) this.pasteNeedsChange = true;
    inputField.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  }

  // Clear the pending fallback when a change event has already been delivered.
  @HostListener('change')
  onChange(): void {
    // A real change has already notified consumers, so no fallback is needed.
    this.pasteNeedsChange = false;
  }

  // Deliver a pending change when a native field loses focus.
  @HostListener('blur')
  onBlur(): void {
    if (this.pasteNeedsChange) {
      // Clear first so dispatching change cannot trigger a duplicate fallback.
      this.pasteNeedsChange = false;
      this.el.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}
