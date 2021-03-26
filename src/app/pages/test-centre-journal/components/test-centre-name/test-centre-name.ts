import { Component, Input } from '@angular/core';

@Component({
  selector: 'test-centre-name',
  templateUrl: 'test-centre-name.html',
  styleUrls: ['test-centre-name.scss'],
})
export class TestCentreNameComponent {

  @Input()
  testCentre: string;

}
