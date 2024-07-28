import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { Manoeuvres } from '@dvsa/mes-test-schema/categories/B/partial';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { OverlayCallback } from '@pages/test-report/test-report.model';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import { getManoeuvres } from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'manoeuvres',
	templateUrl: 'manoeuvres.html',
	styleUrls: ['./manoeuvres.scss'],
})
export class ManoeuvresComponent implements OnInit, OnDestroy {
	@Input()
	controlLabel: string;
	@Input()
	completed: boolean;

	@Input()
	clickCallback: OverlayCallback;

	drivingFaults = 0;
	hasSeriousFault = false;
	hasDangerousFault = false;

	subscription: Subscription;

	displayPopover: boolean;
	manoeuvres$: Observable<CatBUniqueTypes.Manoeuvres>;

	constructor(
		private store$: Store<StoreModel>,
		private faultCountProvider: FaultCountProvider
	) {
		this.displayPopover = false;
	}

	ngOnInit(): void {
		this.manoeuvres$ = this.store$.pipe(
			select(getTests),
			select(getCurrentTest),
			select(getTestData),
			select(getManoeuvres)
		);

		this.subscription = this.manoeuvres$
			.pipe(takeUntil(trDestroy$))
			.subscribe((manoeuvres: CatBUniqueTypes.Manoeuvres) => {
				this.drivingFaults = this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres>(
					TestCategory.B,
					manoeuvres,
					CompetencyOutcome.DF
				);
				this.hasSeriousFault =
					this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres>(TestCategory.B, manoeuvres, CompetencyOutcome.S) >
					0;
				this.hasDangerousFault =
					this.faultCountProvider.getManoeuvreFaultCount<Manoeuvres>(TestCategory.B, manoeuvres, CompetencyOutcome.D) >
					0;
			});
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	togglePopoverDisplay(): void {
		this.displayPopover = !this.displayPopover;
		this.toggleOverlay();
	}

	toggleOverlay(): void {
		if (this.clickCallback) {
			this.clickCallback.callbackMethod();
		}
	}
}
