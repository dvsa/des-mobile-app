import { Directive, ElementRef, HostListener } from '@angular/core';
import emojiRegex from 'emoji-regex';

@Directive({
  selector: '[pasteSanitiser]',
})
export class PasteSanitiserDirective {
  emojiPattern = emojiRegex();

  constructor(private el: ElementRef) {
  }

  @HostListener('paste', ['$event'])
  onInput(event: ClipboardEvent): void {
    const inputField = this.el.nativeElement;
    if (!inputField) return;

    const numbersOnly = inputField.hasAttribute('numbersOnly');
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData) {
      setTimeout(() => {
        let sanitisedData = pastedData;

        // Check if numbersOnly attribute is true
        if (numbersOnly) {
          // Replace non-numeric characters
          sanitisedData = sanitisedData.replace(/\D/g, '');
        }

        // Strip emojis from string
        sanitisedData = sanitisedData.replace(this.emojiPattern, '');

        const maxLength = Number(inputField.getAttribute('maxLength') || Number(inputField.getAttribute('charLimit')));
        // Apply maxLength or charLimit check after sanitizing
        if (maxLength && sanitisedData.length > maxLength) {
          sanitisedData = sanitisedData.substring(0, maxLength);
        }

        // Cast sanitisedData as a number if numbersOnly attribute is present, otherwise just use sanitisedData
        inputField.value = numbersOnly ? Number(sanitisedData) : sanitisedData;
      });
    }
  }
}
