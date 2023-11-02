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
  onInput(event: InputEvent): void {
    event.preventDefault();
    const inputField = this.el.nativeElement;
    if (!inputField) return;
    inputField.value = inputField.value.replace(this.emojiPattern, '');
  }
}
