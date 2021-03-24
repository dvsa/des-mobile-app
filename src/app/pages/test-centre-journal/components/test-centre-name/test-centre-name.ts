import { Component, Input } from '@angular/core';
import { TestCentre } from '../../../../shared/models/test-centre-journal.model';

@Component({
  selector: 'test-centre-name',
  templateUrl: 'test-centre-name.html',
  styleUrls: ['test-centre-name.scss'],
})
export class TestCentreNameComponent {

  @Input()
  testCentres: TestCentre[] = [];

  get testCentreNames(): string {
    return this.testCentres?.map((testCentre: TestCentre) => testCentre.name).join(', ');
  }

}
