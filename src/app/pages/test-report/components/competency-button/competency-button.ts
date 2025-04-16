import { Component, Input } from '@angular/core';

@Component({
    selector: 'competency-button',
    templateUrl: './competency-button.html',
    styleUrls: ['./competency-button.scss'],
    standalone: false
})
export class CompetencyButtonComponent {
  @Input()
  onPress?: Function;

  @Input()
  onTap?: Function;

  @Input()
  ripple?: boolean = true;

  @Input()
  disabled?: boolean = false;

  @Input()
  redBorder?: boolean = false;

  touchState = false;
  touchStateDelay = 100;
  touchTimeout: NodeJS.Timeout;
  rippleTimeout: NodeJS.Timeout;
  rippleState = false;
  rippleEffectAnimationDuration = 300;

  onTapEvent(): void {
    if (this.disabled) {
      return;
    }
    if (this.onTap) {
      this.onTap();
    }
  }

  onPressEvent(): void {
    if (this.disabled) {
      return;
    }
    if (this.onPress) {
      this.onPress();
    }
    if (this.ripple) {
      this.applyRippleEffect();
    }
  }

  applyRippleEffect = (): void => {
    this.rippleState = true;
    this.rippleTimeout = setTimeout(() => this.removeRippleEffect(), this.rippleEffectAnimationDuration);
  };

  removeRippleEffect = (): void => {
    this.rippleState = false;
    clearTimeout(this.rippleTimeout);
  };

  onTouchStart(): void {
    if (this.disabled) {
      return;
    }
    clearTimeout(this.touchTimeout);
    this.touchState = true;
  }

  onTouchEnd(): void {
    if (this.disabled) {
      return;
    }
    // defer the removal of the touch state to allow the page to render
    this.touchTimeout = setTimeout(() => (this.touchState = false), this.touchStateDelay);
  }
}
