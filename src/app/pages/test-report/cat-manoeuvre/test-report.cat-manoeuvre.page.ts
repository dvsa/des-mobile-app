import { Component, Injector, OnInit } from '@angular/core';
import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';
import { Manoeuvre } from '@dvsa/mes-test-schema/categories/CM/partial';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ToastController } from '@ionic/angular';
import { select } from '@ngrx/store';
import { TestDataByCategoryProvider } from '@providers/test-data-by-category/test-data-by-category';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { getTestData } from '@store/tests/test-data/cat-manoeuvres/test-data.cat-manoeuvres.reducer';
import { getManoeuvres } from '@store/tests/test-data/cat-manoeuvres/test-data.cat-manoeuvres.selector';
import { RecordManoeuvresSelection } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { get } from 'lodash-es';
import { Observable, Subscription, merge } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

interface CatManoeuvreTestReportPageState {
  selectedReverseManoeuvre$: Observable<boolean>;
  manoeuvresHasFaults$: Observable<boolean>;
  showUncoupleRecouple$: Observable<boolean>;
}

type TestReportPageState = CommonTestReportPageState & CatManoeuvreTestReportPageState;

@Component({
  selector: '.test-report-cat-manoeuvre-page',
  templateUrl: './test-report.cat-manoeuvre.page.html',
  styleUrls: ['./test-report.cat-manoeuvre.page.scss'],
})
export class TestReportCatManoeuvrePage extends TestReportBasePageComponent implements OnInit {
  manoeuvreTypes = ManoeuvreTypes;
  manoeuvreCompetencies = ManoeuvreCompetencies;
  pageState: TestReportPageState;
  manoeuvresHasFaults: boolean;
  selectedReverseManoeuvre: boolean;
  merged$: Observable<boolean>;
  manoeuvreSubscription: Subscription;

  constructor(
    private testDataByCategory: TestDataByCategoryProvider,
    private toastCtrl: ToastController,
    injector: Injector
  ) {
    super(injector);
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatCMUniqueTypes.TestData>,
      selectedReverseManoeuvre$: currentTest$.pipe(
        withLatestFrom(currentTest$.pipe(select(getTestCategory))),
        map(([data, category]) => this.testDataByCategory.getTestDataByCategoryCode(category)(data)),
        select((testData: CatCMUniqueTypes.TestData) => get(testData, 'manoeuvres.reverseManoeuvre.selected', false))
      ),
      manoeuvresHasFaults$: currentTest$.pipe(
        select(getTestData),
        select(getManoeuvres),
        map((manoeuvres: CatCMUniqueTypes.Manoeuvres) => this.manoeuvreHasFaults(manoeuvres.reverseManoeuvre))
      ),
      showUncoupleRecouple$: currentTest$.pipe(
        select(getTestCategory),
        map((category) => isAnyOf(category, [TestCategory.CEM, TestCategory.C1EM, TestCategory.DEM, TestCategory.D1EM]))
      ),
    };

    const { manoeuvresHasFaults$, selectedReverseManoeuvre$ } = this.pageState;

    this.merged$ = merge(
      selectedReverseManoeuvre$.pipe(map((hasFault) => (this.selectedReverseManoeuvre = hasFault))),
      manoeuvresHasFaults$.pipe(map((hasFault) => (this.manoeuvresHasFaults = hasFault)))
    );

    this.setupSubscription();
  }

  async ionViewWillEnter(): Promise<void> {
    await super.ionViewWillEnter();

    if (this.merged$) {
      this.manoeuvreSubscription = this.merged$.subscribe();
    }
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();

    if (this.manoeuvreSubscription) {
      this.manoeuvreSubscription.unsubscribe();
    }
  }

  manoeuvreHasFaults = (manoeuvre: Manoeuvre): boolean =>
    manoeuvre && (manoeuvre.controlFault != null || manoeuvre.observationFault != null);

  toggleReverseManoeuvre = (): void => {
    if (this.manoeuvresHasFaults) {
      return;
    }
    this.store$.dispatch(RecordManoeuvresSelection(ManoeuvreTypes.reverseManoeuvre));
  };

  competencyClick = async (): Promise<void> => {
    // Stop spawning multiple toast messages on top of each other
    if (await this.toastCtrl.getTop()) {
      return;
    }

    const toast: HTMLIonToastElement = await this.toastCtrl.create({
      message: 'You can only add Serious or Dangerous faults on this test',
      cssClass: 'mes-toast-message-test-report',
      duration: 5000,
      position: 'bottom',
      buttons: [
        {
          text: 'X',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  };

  getId = (manoeuvre: ManoeuvreTypes, competency: ManoeuvreCompetencies) => `${manoeuvre}-${competency}`;
}
