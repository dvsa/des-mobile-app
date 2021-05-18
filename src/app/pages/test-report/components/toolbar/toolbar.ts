import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { getTestReportState } from '../../test-report.reducer';
import { isRemoveFaultMode, isSeriousMode, isDangerousMode } from '../../test-report.selector';
import { ToggleRemoveFaultMode, ToggleSeriousFaultMode, ToggleDangerousFaultMode } from '../../test-report.actions';

interface ToolbarComponentState {
  isSeriousMode$: Observable<boolean>;
  isDangerousMode$: Observable<boolean>;
  isRemoveFaultMode$: Observable<boolean>;
}

@Component({
  selector: 'toolbar',
  templateUrl: 'toolbar.html',
  styleUrls: ['toolbar.scss'],
})
export class ToolbarComponent {

  componentState: ToolbarComponentState;
  subscription: Subscription;

  isRemoveFaultMode: boolean = false;
  isSeriousMode: boolean = false;
  isDangerousMode: boolean = false;

  constructor(private store$: Store<StoreModel>) { }

  ngOnInit(): void {
    this.componentState = {
      isRemoveFaultMode$: this.store$.pipe(
        select(getTestReportState),
        select(isRemoveFaultMode),
      ),
      isSeriousMode$: this.store$.pipe(
        select(getTestReportState),
        select(isSeriousMode),
      ),
      isDangerousMode$: this.store$.pipe(
        select(getTestReportState),
        select(isDangerousMode),
      ),
    };

    const { isRemoveFaultMode$, isSeriousMode$, isDangerousMode$ } = this.componentState;

    const merged$ = merge(
      isRemoveFaultMode$.pipe(map((result) => this.isRemoveFaultMode = result)),
      isSeriousMode$.pipe(map((result) => this.isSeriousMode = result)),
      isDangerousMode$.pipe(map((result) => this.isDangerousMode = result)),
    );

    this.subscription = merged$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleRemoveFaultMode(): void {
    this.store$.dispatch(ToggleRemoveFaultMode(true));
  }

  toggleSeriousMode(): void {
    if (this.isDangerousMode) {
      this.store$.dispatch(ToggleDangerousFaultMode());
    }
    this.store$.dispatch(ToggleSeriousFaultMode(true));
  }

  toggleDangerousMode(): void {
    if (this.isSeriousMode) {
      this.store$.dispatch(ToggleSeriousFaultMode());
    }
    this.store$.dispatch(ToggleDangerousFaultMode(true));
  }

}
