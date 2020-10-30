import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'app-competency',
  templateUrl: 'competency.html',
})
export class CompetencyComponent implements AfterViewInit {

  @Input()
  competency: string;

  faultCount: number;

  hammerInstance;

  constructor() {
    this.faultCount = 0;
  }

  ngAfterViewInit() {
    const element = document.getElementById('competency-button');
    this.hammerInstance = new (window as any).Hammer(element);
    this.hammerInstance.on('press', this.onPress.bind(this));
  }

  onPress($event) {
    console.log('onPress', $event);
    this.faultCount += 1;
  }
}
