import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ActivityCodes } from '@shared/models/activity-codes';
import { StoreModel } from '@shared/models/store.model';
import { SetActivityCode } from '@store/tests/activity-code/activity-code.actions';

@Component({
  selector: 'mot-no-evidence-confirmation',
  templateUrl: './mot-no-evidence-confirmation.html',
  styleUrls: ['./mot-no-evidence-confirmation.scss'],
})
export class MotNoEvidenceConfirmationComponent {
  constructor(
    public router: Router,
    private store$: Store<StoreModel>
  ) {}

  @Input()
  cancelFn: Function;

  @Input()
  nextPageOnFail: string;

  onCancel(): void {
    this.cancelFn();
  }

  async onContinue(): Promise<void> {
    await this.router.navigate([this.nextPageOnFail]);
    this.store$.dispatch(SetActivityCode(ActivityCodes.MOT_INVALID));
  }
}
