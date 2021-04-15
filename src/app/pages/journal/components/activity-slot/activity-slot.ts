import { Component, Input } from '@angular/core';
import { isNil, has } from 'lodash';
import { NonTestActivity, TestSlot } from '@dvsa/mes-journal-schema';
import { Activity, activities } from '@providers/slot-selector/activity.constants';
import { removeLeadingZeros } from '@shared/helpers/formatters';
import { SlotComponent } from '@components/test-slot/slot/slot';

@Component({
  selector: 'activity-slot',
  templateUrl: 'activity-slot.html',
  styleUrls: ['activity-slot.scss'],
})
export class ActivitySlotComponent implements SlotComponent {
  @Input()
  slot: TestSlot | NonTestActivity;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  showLocation: boolean;

  formatActivityCode(): string {
    const { activityCode } = this.slot as NonTestActivity;
    if (isNil(activityCode)) {
      return '0';
    }
    return removeLeadingZeros(activityCode);
  }

  public getTitle(): string {
    let returnTitle: string = 'Unknown';

    const { activityCode } = this.slot as NonTestActivity;
    const matchingActivity: Activity = activities.find((a) => a.activityCode === activityCode);
    if (matchingActivity) {
      return matchingActivity.displayName || matchingActivity.description;
    }
    if (has(this.slot, 'activityDescription') && (this.slot as NonTestActivity).activityDescription !== '') {
      returnTitle = (this.slot as NonTestActivity).activityDescription;
    }
    return returnTitle;
  }

  public isTravelSlot(): boolean {
    return (this.slot as NonTestActivity).activityCode === '091';
  }

}
