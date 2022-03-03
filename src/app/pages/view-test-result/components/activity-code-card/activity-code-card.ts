import { Component, Input } from '@angular/core';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import { ActivityCodes } from '@shared/models/activity-codes';
import { ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';

@Component({
  selector: 'activity-code-card',
  templateUrl: './activity-code-card.html',
})
export class ActivityCodeCard {

  @Input() activityCode: string;

  getActivityCodeDescription() {
    const description = getEnumKeyByValue(ActivityCodes, this.activityCode);
    return `${this.activityCode} - ${ActivityCodeDescription[description[0]]}`;
  }
}
