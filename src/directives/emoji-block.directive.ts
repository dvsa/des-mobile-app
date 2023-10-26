import { Directive, HostListener, ElementRef } from '@angular/core';
import emojiRegex from 'emoji-regex';

@Directive({
  selector: '[emojiBlock]',
})
export class EmojiBlockDirective {
  private emojiPattern = emojiRegex();

  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event'])
  @HostListener('paste', ['$event'])
  onInput(event: InputEvent | ClipboardEvent): void {
    event.preventDefault();
    const inputField = this.el.nativeElement;
    const isPaste = event.type === 'paste';
    const pastedData = isPaste ? (event as ClipboardEvent).clipboardData.getData('text') : null;

    inputField.value = (isPaste ? pastedData : inputField.value).replace(this.emojiPattern, '');
  }
}
