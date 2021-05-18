import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, merge } from 'rxjs';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getEco } from '@store/tests/test-data/common/test-data.selector';
import {
  ToggleEco,
  ToggleControlEco,
  TogglePlanningEco,
} from '@store/tests/test-data/common/eco/eco.actions';
import { map } from 'rxjs/operators';

interface EcoComponentState {
  completed$: Observable<boolean>;
  adviceGivenPlanning$: Observable<boolean>;
  adviceGivenControl$: Observable<boolean>;
}

@Component({
  selector: 'eco',
  templateUrl: 'eco.html',
})
export class EcoComponent implements OnInit {

  subscription: Subscription;

  adviceGivenPlanning: boolean = false;
  adviceGivenControl: boolean = false;
  componentState: EcoComponentState;
  merged$: Observable<boolean>;

  constructor(
    private store$: Store<StoreModel>,
  ) { }

  ngOnInit(): void {

    const eco$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getEco),
    );

    this.componentState = {
      completed$: eco$.pipe(
        map((eco) => eco.completed),
      ),
      adviceGivenPlanning$: eco$.pipe(
        map((eco) => eco.adviceGivenPlanning),
      ),
      adviceGivenControl$: eco$.pipe(
        map((eco) => eco.adviceGivenControl),
      ),
    };

    const { completed$, adviceGivenPlanning$, adviceGivenControl$ } = this.componentState;

    const merged$ = merge(
      completed$,
      adviceGivenPlanning$.pipe(map((toggle) => this.adviceGivenPlanning = toggle)),
      adviceGivenControl$.pipe(map((toggle) => this.adviceGivenControl = toggle)),
    );

    this.subscription = merged$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleEco = (): void => {
    if (this.adviceGivenPlanning || this.adviceGivenControl) {
      return;
    }
    this.store$.dispatch(ToggleEco());
  };

  toggleEcoPlanning = (): void => {
    this.store$.dispatch(TogglePlanningEco());
  };

  toggleEcoControl = (): void => {
    this.store$.dispatch(ToggleControlEco());
  };
}
