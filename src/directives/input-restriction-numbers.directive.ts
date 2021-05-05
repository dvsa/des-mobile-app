import { Directive, ElementRef, HostListener } from '@angular/core';
import { includes } from 'lodash';

@Directive({
  selector: '[numbersOnly]',
})
export class InputRestrictionNumbersDirective {
  constructor(public el: ElementRef) {}

  // Allow usage of control keys aswell as numbers, useful for the browser
  controlKeys = ['ArrowRight', 'ArrowLeft', 'Backspace'];

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const { key } = e;

    if (includes(this.controlKeys, key)) {
      return;
    }

    if (key < '0' || key > '9') {
      e.preventDefault();
    }
  }
}
