import { AfterViewInit, Component, Input } from '@angular/core';
import { LongPress } from '../../../modules/long-press/long-press';

@Component({
  selector: 'app-competency',
  templateUrl: 'competency.html',
})
export class CompetencyComponent implements AfterViewInit {

  @Input()
  competency: string;

  faultCount: number;

  longPress: LongPress;

  constructor() {
    console.log('test');
    this.faultCount = 0;
  }

  ngAfterViewInit() {
    const element = document.getElementById('competency-button');
    this.longPress = new LongPress(element, 300, this.onPress);
  }

  onPress() {
    console.log('onPress');
    this.faultCount = this.faultCount + 1;
    console.log(this);
  }
}
