import { Component, Input } from '@angular/core';
import { isNil, has } from 'lodash';
import { SlotComponent } from '../../../../../components/test-slot/slot/slot';
import { Activity, activities } from '../../../../providers/slot-selector/activity.constants';
import { removeLeadingZeros } from '../../../../shared/helpers/formatters';
// import { Slot } from '../../../../../store/journal/journal.model';

@Component({
  selector: 'activity-slot',
  templateUrl: 'activity-slot.html',
})
export class ActivitySlotComponent implements SlotComponent {
  @Input()
  slot: any;

  @Input()
  hasSlotChanged: boolean;

  @Input()
  showLocation: boolean;

  formatActivityCode(): string {
    const { activityCode } = this.slot;
    if (isNil(activityCode)) {
      return '0';
    }
    return removeLeadingZeros(activityCode);
  }

  public getTitle(): string {
    let returnTitle: string = 'Unknown';

    const { activityCode } = this.slot;
    const matchingActivity: Activity = activities.find((a) => a.activityCode === activityCode);
    if (matchingActivity) {
      return matchingActivity.displayName || matchingActivity.description;
    }
    if (has(this.slot, 'activityDescription') && this.slot.activityDescription !== '') {
      returnTitle = this.slot.activityDescription;
    }
    return returnTitle;
  }

  public isTravelSlot(): boolean {
    return this.slot.activityCode === '091';
  }

}
