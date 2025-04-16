import { Component, Input } from '@angular/core';

@Component({
  selector: 'progressive-access',
  templateUrl: 'progressive-access.html',
  styleUrls: ['progressive-access.scss'],
  standalone: false,
})
export class ProgressiveAccessComponent {
  @Input()
  progressiveAccess: boolean;
}
