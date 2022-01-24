import { Component, Input } from '@angular/core';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ViewTestHeaderModel } from './view-test-header.model';

@Component({
  selector: 'view-test-header',
  templateUrl: 'view-test-header.html',
  styleUrls: ['view-test-header.scss'],
})
export class ViewTestHeaderComponent {

  @Input()
  data: ViewTestHeaderModel;

  isPassed(): boolean {
    return this.data.activityCode === ActivityCodes.PASS;
  }
}
