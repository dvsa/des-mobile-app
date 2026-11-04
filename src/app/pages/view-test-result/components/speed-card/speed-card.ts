import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Avoidance, EmergencyStop } from '@dvsa/mes-test-schema/categories/AM1';
import { IonCol, IonGrid, IonRow } from '@ionic/angular';

@Component({
  selector: 'speed-card',
  templateUrl: 'speed-card.html',
  styleUrls: ['speed-card.scss'],
  imports: [IonRow, NgClass, IonGrid, IonCol],
})
export class SpeedCardComponent {
  @Input()
  shouldHaveSeperator = true;

  @Input()
  public emergencyStop: EmergencyStop;

  @Input()
  public avoidance: Avoidance;
}
