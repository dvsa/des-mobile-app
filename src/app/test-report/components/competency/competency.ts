import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-competency',
  templateUrl: 'competency.html',
})
export class CompetencyComponent {

  @Input()
  competency: string;

  constructor() {}

  addFault = (): void => {
    console.log('adding fault...');
  }
}
