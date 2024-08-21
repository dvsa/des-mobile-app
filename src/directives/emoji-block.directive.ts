import { Directive, ElementRef, HostListener } from '@angular/core';
import emojiRegex from 'emoji-regex';

@Directive({
  selector: '[emojiBlock]',
})
export class EmojiBlockDirective {
  emojiPattern = emojiRegex();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(): void {
    // Grab element
    const inputField = this.el.nativeElement;
    if (!inputField) return;

    // Strip emojis out
    inputField.value = inputField.value.replace(this.emojiPattern, '');
  }
}
