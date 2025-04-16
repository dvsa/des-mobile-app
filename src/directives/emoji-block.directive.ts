import { Directive, ElementRef, HostListener } from '@angular/core';
import emojiRegex from 'emoji-regex';

@Directive({
    selector: '[emojiBlock]',
    standalone: false
})
export class EmojiBlockDirective {
  emojiPattern = emojiRegex();

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(): void {
    // Grab element
    const inputField = this.el.nativeElement;

    // Check if inputField is null or empty
    if (!inputField || !inputField?.value) return;

    // Strip emojis out
    inputField.value = inputField.value.replace(this.emojiPattern, '');
  }
}
