import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'competency-button',
  templateUrl: './competency-button.html',
  styleUrls: ['./competency-button.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetencyButtonComponent {
  @Input() allowRipple = true;
  @Input() disabled = false;
  @Input() showRedBorder = false;
  @Input() buttonId = '';

  @Output() onPress: EventEmitter<void> = new EventEmitter();
  @Output() onTap: EventEmitter<void> = new EventEmitter();

  touchStateDelay = 100;
  rippleEffectAnimationDuration = 300;
  longPressDelay = 301;

  touchState = signal(false);
  rippleState = signal(false);

  private pressTimeout: NodeJS.Timeout;

  @HostListener('pointerdown', ['$event'])
  onPointerDown(_event: PointerEvent) {
    //Once the user begins pressing,
    // emit the tap event and start the countdown towards the click being considered a long press.
    if (this.disabled) return;
    this.onTap.emit();
    this.pressTimeout = setTimeout(() => {
      this.onPress.emit();
      if (this.allowRipple) this.triggerRipple();
    }, this.longPressDelay);
  }

  @HostListener('pointerup')
  @HostListener('pointerleave')
  @HostListener('pointercancel')
  onPointerEnd() {
    //If the user releases the press before the long press delay, cancel the long press action.
    clearTimeout(this.pressTimeout);
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
}
