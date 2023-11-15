import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[pasteSanitiser]',
})
export class PasteSanitiserDirective {

  constructor(private el: ElementRef) {
  }

  @HostListener('paste')
  onInput(): void {
    const inputField = this.el.nativeElement;
    if (!inputField) return;

    // Checks input field for either 'maxLength' or 'charLimit' attribute then uses that as the max length value
    const maxLength = Number(inputField.getAttribute('maxLength') || Number(inputField.getAttribute('charLimit')));

    if (maxLength && inputField.value.length > maxLength) {
      inputField.value = inputField.value.substring(0, maxLength);
    }
  }
}
