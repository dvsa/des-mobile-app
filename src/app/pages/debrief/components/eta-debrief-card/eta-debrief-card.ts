import { Component, Input } from '@angular/core';

@Component({
  selector: 'eta-debrief-card',
  templateUrl: 'eta-debrief-card.html',
  styleUrls: ['eta-debrief-card.scss'],
})
export class EtaDebriefCardComponent {
  @Input()
  public hasPhysicalEta = false;

  @Input()
  public hasVerbalEta = false;
}
