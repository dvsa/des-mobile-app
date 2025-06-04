import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[keyboardInputListener]',
  standalone: true,
})
export class KeyboardInputListenerDirective {
  constructor(private el: ElementRef) {}

  @Output()
  keypressRegistered: EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // Check if the element has the 'has-focus' class (meaning it is focused)
    if (this.el?.nativeElement?.classList?.contains('has-focus')) {
      // Emit the event if the element is focused
      this.keypressRegistered.emit(event);
    }
  }
}
