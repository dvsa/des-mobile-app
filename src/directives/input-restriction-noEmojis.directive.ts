import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[noEmoji]',
})
export class InputRestrictionNoEmojiDirective {
  constructor(public ref: ElementRef) {
  }

  @HostListener('input', ['$event']) onInput(event: { target: { value: string; }; }) {
    this.ref.nativeElement.value = event.target.value
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/, '')
      .trim();
  }
}
