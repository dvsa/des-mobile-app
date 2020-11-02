import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-competency',
  templateUrl: 'competency.html',
})
export class CompetencyComponent {

  @Input()
  competency: string;

  faultCount: number;

  constructor() {
    this.faultCount = 0;
  }

  onPress($event) {
    console.log('onPress', $event);
    this.faultCount += 1;
  }
}
