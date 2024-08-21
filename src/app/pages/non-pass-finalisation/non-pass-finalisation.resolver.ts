import { Injectable } from '@angular/core';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

import { OutcomeBehaviourMapping } from '@providers/outcome-behaviour-map/outcome-behaviour-map.model';
import { ActivityCodeModel, getActivityCodeOptions } from '@shared/constants/activity-code/activity-code.constants';
import { getBehaviourMapByCategory } from '@shared/helpers/behaviour-map-by-category';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { get } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class NonPassFinalisationResolver {
  constructor(private store$: Store<StoreModel>) {}

  resolve(): Observable<[OutcomeBehaviourMapping, ActivityCodeModel[]]> {
    return forkJoin([this.getBehaviourMap(), this.getActivityCodeList()]).pipe(
      take(1),
      catchError((err) => of(err))
    );
  }

  private getBehaviourMap(): Observable<OutcomeBehaviourMapping> {
    return this.store$
      .pipe(
        select(getTests),
        select(getCurrentTest),
        select(getTestCategory),
        map((testCategory) => getBehaviourMapByCategory(testCategory as TestCategory))
      )
      .pipe(
        take(1),
        catchError((err) => of(err))
      );
  }

  private getActivityCodeList(): Observable<ActivityCodeModel[]> {
    return this.store$
      .pipe(
        select(getTests),
        select(getCurrentTest),
        map((test) =>
          getActivityCodeOptions(
            get(test, 'delegatedTest', false),
            test.category === TestCategory.ADI3 || test.category === TestCategory.SC
          )
        )
      )
      .pipe(
        take(1),
        catchError((err) => of(err))
      );
  }
}
