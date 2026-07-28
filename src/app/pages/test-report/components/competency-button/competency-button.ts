import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
} from '@angular/core';

@Component({
  selector: 'competency-button',
  templateUrl: './competency-button.html',
  styleUrls: ['./competency-button.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetencyButtonComponent {
  constructor(private hostElementRef: ElementRef<HTMLElement>) {}

  @Input() allowRipple = true;
  @Input() disabled = false;
  @Input() showRedBorder = false;
  @Input() buttonId = '';

  @Output() onPress: EventEmitter<void> = new EventEmitter();
  @Output() onTap: EventEmitter<void> = new EventEmitter();

  touchStateDelay = 100;
  rippleEffectAnimationDuration = 300;
  longPressDelay = 301;
  moveTolerance = 10;

  touchState = signal(false);
  rippleState = signal(false);

  private pressTimeout?: NodeJS.Timeout;
  private activePointerId: number | null = null;
  private hasEmittedPress = false;
  private startX = 0;
  private startY = 0;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent) {
    //Once the user begins pressing,
    // emit the tap event and start the countdown towards the click being considered a long press.
    if (this.disabled) return;

    this.cancelLongPress();
    this.activePointerId = event.pointerId;
    this.touchState.set(true);
    this.hasEmittedPress = false;
    this.startX = event.clientX;
    this.startY = event.clientY;

    // Keep receiving pointer events even if the finger leaves the host element.
    this.getHostElement(event)?.setPointerCapture?.(event.pointerId);

    this.pressTimeout = setTimeout(() => {
      if (this.activePointerId !== event.pointerId) return;
      this.hasEmittedPress = true;
      this.onPress.emit();
      if (this.allowRipple) this.triggerRipple();
    }, this.longPressDelay);
  }

  @HostListener('pointermove', ['$event'])
  onPointerMove(event: PointerEvent) {
    if (!this.isActivePointer(event)) return;

    // cancel press and unset touch state if pointer moves out of element bounds
    const xDistance = Math.abs(event.clientX - this.startX);
    const yDistance = Math.abs(event.clientY - this.startY);
    if (!this.isPointerInsideHost(event) || xDistance > this.moveTolerance || yDistance > this.moveTolerance) {
      this.touchState.set(false);
      this.cancelLongPress();
      return;
    }

    this.touchState.set(true);
  }

  @HostListener('pointerup', ['$event'])
  @HostListener('pointerleave', ['$event'])
  @HostListener('pointercancel', ['$event'])
  onPointerEnd(event?: PointerEvent) {
    if (event && this.activePointerId !== null && !this.isActivePointer(event)) return;

    const shouldEmitTap =
      !!event && this.activePointerId !== null && !this.hasEmittedPress && this.isPointerInsideHost(event);

    //If the user releases the press before the long press delay, cancel the long press action.
    this.touchState.set(false);
    this.cancelLongPress();

    if (event) {
      this.getHostElement(event)?.releasePointerCapture?.(event.pointerId);
    }

    if (shouldEmitTap) {
      this.onTap.emit();
    }
  }

  onTouchStart(): void {
    if (this.disabled) return;
    this.touchState.set(true);
  }

  onTouchEnd(): void {
    if (this.disabled) return;
    setTimeout(() => this.touchState.set(false), this.touchStateDelay);
  }

  triggerRipple(): void {
    this.rippleState.set(true);
    setTimeout(() => this.rippleState.set(false), this.rippleEffectAnimationDuration);
  }

  private cancelLongPress(): void {
    clearTimeout(this.pressTimeout);
    this.pressTimeout = undefined;
    this.activePointerId = null;
  }

  private isActivePointer(event: PointerEvent): boolean {
    return this.activePointerId !== null && event.pointerId === this.activePointerId;
  }

  private getHostElement(event: PointerEvent): HTMLElement | null {
    return event.currentTarget instanceof HTMLElement ? event.currentTarget : null;
  }

  private isPointerInsideHost(event: PointerEvent): boolean {
    const bounds = this.hostElementRef.nativeElement.getBoundingClientRect();

    // Synthetic/unit test hosts can have a zero-size box; skip bounds enforcement in that case.
    if (bounds.width === 0 && bounds.height === 0) return true;

    return (
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom
    );
  }
}
