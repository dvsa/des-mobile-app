import { Inject, Injectable, Injector, OnInit } from '@angular/core';
import { ViewDidLeave } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { getTests } from '@store/tests/tests.reducer';
import { isEndToEndPracticeTest, isPracticeMode, isTestReportPracticeTest } from '@store/tests/tests.selector';
import { Observable, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreModel } from '../models/store.model';
import { BasePageComponent } from './base-page';

interface PracticeableBasePageState {
	isPracticeMode$: Observable<boolean>;
	isTestReportPracticeMode$: Observable<boolean>;
	isEndToEndPracticeMode$: Observable<boolean>;
}

@Injectable()
export abstract class PracticeableBasePageComponent extends BasePageComponent implements OnInit, ViewDidLeave {
	public store$ = this.injector.get<Store<StoreModel>>(Store);

	public isPracticeMode: boolean;
	public isTestReportPracticeMode: boolean;
	public isEndToEndPracticeMode: boolean;

	private practiceableBasePageState: PracticeableBasePageState;
	private practiceableBasePageSubscription: Subscription;

	protected constructor(
		injector: Injector,
		@Inject(true) public loginRequired = true
	) {
		super(injector, loginRequired);
	}

	ngOnInit(): void {
		this.practiceableBasePageState = {
			isPracticeMode$: this.store$.pipe(select(getTests), select(isPracticeMode)),
			isTestReportPracticeMode$: this.store$.pipe(select(getTests), select(isTestReportPracticeTest)),
			isEndToEndPracticeMode$: this.store$.pipe(select(getTests), select(isEndToEndPracticeTest)),
		};

		const { isPracticeMode$, isTestReportPracticeMode$, isEndToEndPracticeMode$ } = this.practiceableBasePageState;

		const merged$ = merge(
			isPracticeMode$.pipe(map((value) => (this.isPracticeMode = value))),
			isTestReportPracticeMode$.pipe(map((value) => (this.isTestReportPracticeMode = value))),
			isEndToEndPracticeMode$.pipe(map((value) => (this.isEndToEndPracticeMode = value)))
		);

		this.practiceableBasePageSubscription = merged$.subscribe();
	}

	ionViewDidLeave(): void {
		if (this.practiceableBasePageSubscription) {
			this.practiceableBasePageSubscription.unsubscribe();
		}
	}

	exitPracticeMode = async () => {
		await this.router.navigate([FAKE_JOURNAL_PAGE]);
	};
}
