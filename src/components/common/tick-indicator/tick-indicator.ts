import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonIcon } from '@ionic/angular';

@Component({
  selector: 'tick-indicator',
  templateUrl: 'tick-indicator.html',
  styleUrls: ['./tick-indicator.scss'],
  imports: [NgClass, IonIcon],
})
export class TickIndicatorComponent {
  @Input()
  ticked: boolean;
}
