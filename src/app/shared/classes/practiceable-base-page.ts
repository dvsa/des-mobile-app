import { Platform } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { Observable, merge, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { getTests } from '@store/tests/tests.reducer';
import { isPracticeMode, isTestReportPracticeTest, isEndToEndPracticeTest } from '@store/tests/tests.selector';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreModel } from '../models/store.model';
import { BasePageComponent } from './base-page';

interface PracticeableBasePageState {
  isPracticeMode$: Observable<boolean>;
  isTestReportPracticeMode$: Observable<boolean>;
  isEndToEndPracticeMode$: Observable<boolean>;
}

export abstract class PracticeableBasePageComponent extends BasePageComponent implements OnInit {

  public isPracticeMode: boolean;
  public isTestReportPracticeMode: boolean;
  public isEndToEndPracticeMode: boolean;

  private practiceableBasePageState: PracticeableBasePageState;
  private practiceableBasePageSubscription: Subscription;

  constructor(
    public platform: Platform,
    public router: Router,
    public authenticationProvider: AuthenticationProvider,
    public store$: Store<StoreModel>,
    public loginRequired: boolean = true,
  ) {
    super(platform, authenticationProvider, router, loginRequired);
  }

  ngOnInit(): void {
    this.practiceableBasePageState = {
      isPracticeMode$: this.store$.pipe(
        select(getTests),
        select(isPracticeMode),
      ),
      isTestReportPracticeMode$: this.store$.pipe(
        select(getTests),
        select(isTestReportPracticeTest),
      ),
      isEndToEndPracticeMode$: this.store$.pipe(
        select(getTests),
        select(isEndToEndPracticeTest),
      ),
    };

    const {
      isPracticeMode$,
      isTestReportPracticeMode$,
      isEndToEndPracticeMode$,
    } = this.practiceableBasePageState;

    const merged$ = merge(
      isPracticeMode$.pipe(map((value) => this.isPracticeMode = value)),
      isTestReportPracticeMode$.pipe(map((value) => this.isTestReportPracticeMode = value)),
      isEndToEndPracticeMode$.pipe(map((value) => this.isEndToEndPracticeMode = value)),
    );

    this.practiceableBasePageSubscription = merged$.subscribe();
  }

  ionViewDidLeave(): void {
    if (this.practiceableBasePageSubscription) {
      this.practiceableBasePageSubscription.unsubscribe();
    }
  }

  exitPracticeMode = (): void => {
    // @TODO enable once practice mode added (MES-6867)
    // this.router.navigate([PRACTICE_JOURNAL_PAGE]);
  };

}
