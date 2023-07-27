import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { ActivityCodes } from '@shared/models/activity-codes';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'eyesight-failure-confirmation',
  templateUrl: './eyesight-failure-confirmation.html',
  styleUrls: ['./eyesight-failure-confirmation.scss'],
})
export class EyesightFailureConfirmationComponent {

  constructor(
    public router: Router,
    private store$: Store<StoreModel>,
  ) {
  }

  @Input()
  cancelFn: Function;

  @Input()
  nextPageOnFail: string;

  onCancel(): void {
    this.cancelFn();
  }

  async onContinue(): Promise<void> {
    await this.router.navigate([this.nextPageOnFail]);
    this.store$.dispatch(SetActivityCode(ActivityCodes.FAIL_EYESIGHT));
  }
}
