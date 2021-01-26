import { Component, Input } from '@angular/core';

@Component({
  selector: 'progressive-access',
  templateUrl: 'progressive-access.html',
})
export class ProgressiveAccessComponent {

  @Input()
  progressiveAccess: boolean;

}
