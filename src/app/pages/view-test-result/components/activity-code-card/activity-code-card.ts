import { Component, Input } from '@angular/core';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { IonCard, IonCardContent, IonCardHeader, IonGrid } from '@ionic/angular';
import { ActivityCodeDescription } from '@shared/constants/activity-code/activity-code.constants';
import { getEnumKeyByValue } from '@shared/helpers/enum-keys';
import { ActivityCodes } from '@shared/models/activity-codes';

@Component({
  selector: 'activity-code-card',
  templateUrl: './activity-code-card.html',
  imports: [IonCard, IonCardHeader, IonCardContent, IonGrid, DataRowComponent],
})
export class ActivityCodeCard {
  @Input() activityCode: string;

  getActivityCodeDescription() {
    const [description] = getEnumKeyByValue(ActivityCodes, this.activityCode);
    return `${this.activityCode} - ${ActivityCodeDescription[description]}`;
  }
}
