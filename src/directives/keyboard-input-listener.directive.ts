import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[keyboardInputListener]',
  standalone: true,
})
export class KeyboardInputListenerDirective {
  constructor(private el: ElementRef) {}

  @Output()
  keypressUpRegistered: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  @Output()
  keypressDownRegistered: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
    // Check if the element has the 'has-focus' class (meaning it is focused)
    if (this.el?.nativeElement?.classList?.contains('has-focus')) {
      // Emit the event if the element is focused
      this.keypressUpRegistered.emit(event);
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
    // Check if the element has the 'has-focus' class (meaning it is focused)
    if (this.el?.nativeElement?.classList?.contains('has-focus')) {
      // Emit the event if the element is focused
      this.keypressDownRegistered.emit(event);
    }
  }
}
