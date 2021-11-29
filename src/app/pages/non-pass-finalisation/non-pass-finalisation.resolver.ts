import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { catchError, map, take } from 'rxjs/operators';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getBehaviourMapByCategory } from '@shared/helpers/behaviour-map-by-category';
import { OutcomeBehaviourMapping } from '@providers/outcome-behaviour-map/outcome-behaviour-map.model';

@Injectable({
  providedIn: 'root',
})
export class NonPassFinalisationResolver implements Resolve<Observable<OutcomeBehaviourMapping>> {
  constructor(
    private store$: Store<StoreModel>,
  ) {
  }

  resolve(): Observable<OutcomeBehaviourMapping> {
    return this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      select(getTestCategory),
      map((testCategory) => getBehaviourMapByCategory(testCategory as TestCategory)),
    ).pipe(
      take(1),
      catchError((err) => of(err)),
    );
  }
}
