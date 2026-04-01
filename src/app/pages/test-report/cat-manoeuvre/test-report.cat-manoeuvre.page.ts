import { Component, OnInit, computed } from '@angular/core';
import { Manoeuvre } from '@dvsa/mes-test-schema/categories/CM/partial';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ToastController } from '@ionic/angular';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { isAnyOf } from '@shared/helpers/simplifiers';
import { RecordManoeuvresSelection } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { get } from 'lodash-es';
import { Observable } from 'rxjs';

interface CatManoeuvreTestReportPageState {
  manoeuvresHasFaults$: Observable<boolean>;
  showUncoupleRecouple$: Observable<boolean>;
}

type TestReportPageState = CatManoeuvreTestReportPageState;

@Component({
  selector: '.test-report-cat-manoeuvre-page',
  templateUrl: './test-report.cat-manoeuvre.page.html',
  styleUrls: ['./test-report.cat-manoeuvre.page.scss'],
  standalone: false,
})
export class TestReportCatManoeuvrePage extends TestReportBasePageComponent implements OnInit {
  manoeuvreTypes = ManoeuvreTypes;
  manoeuvreCompetencies = ManoeuvreCompetencies;

  selectedReverseManoeuvre = computed(() => {
    console.log(this.testData(), get(this.testData(), 'manoeuvres.reverseManoeuvre.selected', false));
    return get(this.testData(), 'manoeuvres.reverseManoeuvre.selected', false);
  });

  showUncoupleRecouple = computed(() => {
    return isAnyOf(this.category, [TestCategory.CEM, TestCategory.C1EM, TestCategory.DEM, TestCategory.D1EM]);
  });

  manoeuvresHasFaults = computed(() => {
    return this.manoeuvreHasFaults(get(this.testData(), 'manoeuvres', null)?.reverseManoeuvre);
  });

  constructor(private toastCtrl: ToastController) {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  manoeuvreHasFaults = (manoeuvre: Manoeuvre): boolean =>
    manoeuvre && (manoeuvre.controlFault != null || manoeuvre.observationFault != null);

  toggleReverseManoeuvre = (): void => {
    if (this.manoeuvresHasFaults()) {
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
