import { Component, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getSafetyAndBalanceQuestions } from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.selector';
import { getTestData } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

interface ComponentState {
	safetyAndBalanceDrivingFaultCount$: Observable<number>;
}

@Component({
	selector: 'safety-and-balance',
	templateUrl: 'safety-and-balance.html',
	styleUrls: ['safety-and-balance.scss'],
})
export class SafetyAndBalanceComponent implements OnInit {
	componentState: ComponentState;
	category: TestCategory = TestCategory.EUAM2;

	constructor(
		private store$: Store<StoreModel>,
		public faultCountProvider: FaultCountProvider
	) {}

	ngOnInit(): void {
		const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));
		const category$ = currentTest$.pipe(
			select(getTestCategory),
			map((result) => (this.category = result as TestCategory))
		);

		this.componentState = {
			safetyAndBalanceDrivingFaultCount$: currentTest$.pipe(
				select(getTestData),
				select(getSafetyAndBalanceQuestions),
				withLatestFrom(category$),
				map(
					([safetyAndBalance, category]) =>
						this.faultCountProvider.getSafetyAndBalanceFaultCount(category, safetyAndBalance).drivingFaults
				)
			),
		};
	}
}
