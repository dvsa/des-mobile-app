import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-item',
  templateUrl: 'dashboard-item.html',
  styleUrls: ['dashboard-item.scss'],
})
export class DashboardItemComponent {
  @Input()
  title: string;

  @Input()
  isInvalid: boolean;

  @Input()
  isValid: boolean;

  @Input()
  score: number;

  @Input()
  maxScore: number;

  @Input()
  showCompleted: boolean;

  @Input()
  idSelector: string;
}
