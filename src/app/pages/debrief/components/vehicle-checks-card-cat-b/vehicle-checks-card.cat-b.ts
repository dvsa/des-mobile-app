import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreModel } from '@shared/models/store.model';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, merge } from 'rxjs';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store//tests/tests.selector';
import { getTestData } from '@store//tests/test-data/cat-b/test-data.reducer';
import { getVehicleChecks } from '@store//tests/test-data/cat-b/test-data.cat-b.selector';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { map } from 'rxjs/operators';

interface VehicleChecksCardComponentState {
  showMeQuestionOutcome$: Observable<QuestionOutcome>;
  tellMeQuestionHasFault$: Observable<boolean>;
  hasVehicleChecksFault$: Observable<boolean>;
}

@Component({
  selector: 'vehicle-checks-card-cat-b',
  templateUrl: 'vehicle-checks-card.cat-b.html',
  styleUrls: ['vehicle-checks-card.cat-b.scss'],
})
export class VehicleChecksCardCatBComponent implements OnInit, OnDestroy {

  componentState: VehicleChecksCardComponentState;
  hasFault: boolean = false;
  hasShowMeFault: boolean = false;

  subscription: Subscription;

  constructor(private store$: Store<StoreModel>) { }

  ngOnInit(): void {
    const vehicleChecks$: Observable<CatBUniqueTypes.VehicleChecks> = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestData),
      select(getVehicleChecks),
    );

    this.componentState = {
      showMeQuestionOutcome$: vehicleChecks$.pipe(
        select(VehicleChecksCardCatBComponent.getShowMeQuestionOutcome),
      ),
      tellMeQuestionHasFault$: vehicleChecks$.pipe(
        select(VehicleChecksCardCatBComponent.tellMeQuestionHasFault),
      ),
      hasVehicleChecksFault$: vehicleChecks$.pipe(
        select(VehicleChecksCardCatBComponent.hasVehicleChecksFault),
      ),
    };

    const { hasVehicleChecksFault$, showMeQuestionOutcome$ } = this.componentState;

    this.subscription = merge(
      hasVehicleChecksFault$.pipe(map((val) => this.hasFault = val)),
      showMeQuestionOutcome$.pipe(map((val) => this.hasShowMeFault = val !== CompetencyOutcome.P)),
    ).subscribe();

  }

  static tellMeQuestionHasFault = (vehicleChecks: CatBUniqueTypes.VehicleChecks): boolean =>
    vehicleChecks.tellMeQuestion.outcome === CompetencyOutcome.DF;

  static getShowMeQuestionOutcome = (vehicleChecks: CatBUniqueTypes.VehicleChecks): QuestionOutcome =>
    vehicleChecks.showMeQuestion.outcome;

  static hasVehicleChecksFault = (vehicleChecks: CatBUniqueTypes.VehicleChecks): boolean =>
    (vehicleChecks.tellMeQuestion.outcome && vehicleChecks.tellMeQuestion.outcome !== CompetencyOutcome.P)
    || (vehicleChecks.showMeQuestion.outcome && vehicleChecks.showMeQuestion.outcome !== CompetencyOutcome.P);

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
