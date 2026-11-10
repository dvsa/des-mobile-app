import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonCol, IonIcon, IonRow } from '@ionic/angular';
import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';

@Component({
  selector: 'test-centre-name',
  templateUrl: 'test-centre-name.html',
  styleUrls: ['test-centre-name.scss'],
  imports: [IonRow, IonCol, IonIcon, NgClass],
})
export class TestCentreNameComponent {
  @Input()
  testCentreResults: TestCentreDetailResponse;
}
