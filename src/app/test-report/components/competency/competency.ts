import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-competency',
  templateUrl: 'competency.html',
})
export class CompetencyComponent implements AfterViewInit {

  @Input()
  competency: string;
  isPressed = false;
  timeoutId: number;
  @Output() press: EventEmitter<any> = new EventEmitter<any>();

  ngAfterViewInit() {
    const element = document.getElementById('competency-button');
    element.addEventListener('mousedown', () => this.pressdown());
    element.addEventListener('mouseup',  () => this.pressup());
    element.addEventListener('touchstart', () => this.pressdown());
    element.addEventListener('touchend',  () => this.pressup());
  }

  pressdown() {
    this.isPressed = true;
    this.timeoutId = setTimeout((competency) => {
      if (competency.isPressed) {
        competency.press.emit();
      }
    }, 300, this);
  }

  pressup() {
    this.isPressed = false;
    clearTimeout(this.timeoutId);
  }
}
