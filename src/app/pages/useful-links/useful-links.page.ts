// useful-links.page.ts
import { Component, Injector } from '@angular/core';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { BasePageComponent } from '@shared/classes/base-page';

@Component({
  selector: 'useful-links',
  templateUrl: 'useful-links.page.html',
  styleUrls: ['useful-links.page.scss'],
})
export class UsefulLinksPage extends BasePageComponent {
  constructor(
    public orientationMonitorProvider: OrientationMonitorProvider,
    injector: Injector
  ) {
    super(injector);
  }
  protected readonly alert = alert;
}
