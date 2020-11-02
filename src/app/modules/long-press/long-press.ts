export class LongPress {

  element: HTMLElement;
  duration: number;
  onPress: () => void;
  isPressed = false;

  constructor(element: HTMLElement, duration: number, onPress: () => void) {
    this.element = element;
    this.duration = duration;
    this.onPress = onPress;
    element.addEventListener('mousedown', () => this.press());
    element.addEventListener('mouseup',  () => this.pressup());
  }

  press() {
    console.log('press');
    this.isPressed = true;
    setTimeout(this.timeoutFunc, this.duration, this);
  }

  timeoutFunc(longPress) {
    if (longPress.isPressed) {
      longPress.onPress();
    }
  }

  pressup() {
    console.log('pressup');
    this.isPressed = false;
  }

}
