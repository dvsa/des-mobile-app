import { Component, computed, inject } from '@angular/core';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { QuestionOutcome } from '@dvsa/mes-test-schema/categories/common';
import { Store } from '@ngrx/store';

import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { IonCard, IonCardContent, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { TranslatePipe } from '@ngx-translate/core';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getVehicleChecks } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { selectCurrentTest } from '@store/tests/tests.selector';

@Component({
  selector: 'vehicle-checks-card-cat-b',
  templateUrl: 'vehicle-checks-card.cat-b.html',
  styleUrls: ['vehicle-checks-card.cat-b.scss'],
  imports: [IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText, AddOrRemoveLangCyDirective, TranslatePipe],
})
export class VehicleChecksCardCatBComponent {
  private store$ = inject<Store<StoreModel>>(Store);
  private currentTest = this.store$.selectSignal(selectCurrentTest);
  private vehicleChecks = computed(() => {
    const test = this.currentTest();
    return test ? getVehicleChecks(getTestData(test as never) as never) : null;
  });

  showMeQuestionOutcome = computed(() => this.vehicleChecks()?.showMeQuestion.outcome);
  tellMeQuestionHasFault = computed(() =>
    this.vehicleChecks() ? VehicleChecksCardCatBComponent.tellMeQuestionHasFault(this.vehicleChecks()) : false
  );
  hasVehicleChecksFault = computed(() =>
    this.vehicleChecks() ? VehicleChecksCardCatBComponent.hasVehicleChecksFault(this.vehicleChecks()) : false
  );
  hasShowMeFault = computed(() => this.vehicleChecks()?.showMeQuestion.outcome !== CompetencyOutcome.P);

  static tellMeQuestionHasFault = (vehicleChecks: CatBUniqueTypes.VehicleChecks): boolean =>
    vehicleChecks.tellMeQuestion.outcome === CompetencyOutcome.DF;

  static getShowMeQuestionOutcome = (vehicleChecks: CatBUniqueTypes.VehicleChecks): QuestionOutcome =>
    vehicleChecks.showMeQuestion.outcome;

  static hasVehicleChecksFault = (vehicleChecks: CatBUniqueTypes.VehicleChecks): boolean =>
    (vehicleChecks.tellMeQuestion.outcome && vehicleChecks.tellMeQuestion.outcome !== CompetencyOutcome.P) ||
    (vehicleChecks.showMeQuestion.outcome && vehicleChecks.showMeQuestion.outcome !== CompetencyOutcome.P);
}
