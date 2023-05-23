import { Component, Input } from '@angular/core';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import { ViewTestHeaderModel } from './view-test-header.model';

@Component({
  selector: 'view-test-header',
  templateUrl: 'view-test-header.html',
  styleUrls: ['view-test-header.scss'],
})
export class ViewTestHeaderComponent {

  @Input()
  data: ViewTestHeaderModel;

  @Input()
  appVersion: string;

  @Input()
  zoom: string;

  getActivityCodeDescription() {
    const description = getEnumKeyByValue(ActivityCodes, this.data.activityCode);
    return ActivityCodeDescription[description[0]];
  }

  isPassed(): boolean {
    return this.data.activityCode === ActivityCodes.PASS;
  }
}
