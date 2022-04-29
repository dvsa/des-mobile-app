import { Component, Input } from '@angular/core';

@Component({
  selector: 'eta-card',
  templateUrl: './eta-card.component.html',
  styleUrls: ['./eta-card.component.scss'],
})
export class ETACardComponent {
  @Input()
  faults: string;
}
