import { Directive, ElementRef, HostListener } from '@angular/core';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';

@Directive({
  selector: '[pasteSanitiser]',
})
export class PasteSanitiserDirective {
  private readonly emojiPattern: RegExp;

  constructor(private el: ElementRef, private emojiBlockDirective: EmojiBlockDirective) {
    this.emojiPattern = this.emojiBlockDirective.emojiPattern;
  }

  @HostListener('paste', ['$event'])
  onInput(event: ClipboardEvent): void {
    event.preventDefault();
    const inputField = this.el.nativeElement;
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData) {
      const maxLength = Number(inputField.getAttribute('maxLength') || inputField.getAttribute('charLimit'));

      inputField.value = pastedData.replace(this.emojiPattern, '');

      if (maxLength && inputField.value.length > maxLength) {
        inputField.value = inputField.value.substring(0, maxLength);
      }
    }
  }
}
