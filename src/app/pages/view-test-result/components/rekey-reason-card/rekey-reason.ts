import { Component, Input } from '@angular/core';
import { RekeyReason, IpadIssue } from '@dvsa/mes-test-schema/categories/common';
import { get } from 'lodash';

@Component({
  selector: 'rekey-reason-card',
  templateUrl: 'rekey-reason-card.html',
})
export class RekeyReasonCardComponent {

  @Input()
  data: RekeyReason;

  @Input()
  zoom: string;

  public get iPadIssue(): string {
    const isIpadIssueSelected:boolean = get(this.data, 'ipadIssue.selected', false);
    return isIpadIssueSelected ? RekeyReasonCardComponent.getIpadIssueDisplayText(get(this.data, 'ipadIssue')) : 'None';
  }

  public get transfer(): string {
    const isTransferSelected: boolean = get(this.data, 'transfer.selected', false);
    return isTransferSelected ? 'Yes' : 'No';
  }

  public get other(): string {
    const isOtherSelected: boolean = get(this.data, 'other.selected', false);
    return isOtherSelected ? get(this.data, 'other.reason') : 'N/A';
  }

  private static getIpadIssueDisplayText(reasonType: IpadIssue): string {
    let value = '';

    if (reasonType.broken) {
      value = 'Broken';
    }

    if (reasonType.lost) {
      value = 'Lost';
    }

    if (reasonType.technicalFault) {
      value = 'Technical fault';
    }

    if (reasonType.stolen) {
      value = 'Stolen';
    }

    return value;
  }

}
