import { Component, OnInit } from '@angular/core';
import { Business, TestSlot } from '@dvsa/mes-journal-schema';
import { ModalController, NavParams } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Details } from './candidate-details.page.model';
import { StoreModel } from '../../shared/models/store.model';
import * as journalActions from '../../../store/journal/journal.actions';
import * as candidateDetailActions from '../../../store/candidate-details/candidate-details.actions';
import {
  getBusiness,
  getCandidateName,
  getDetails,
  getTime,
} from '../../../store/candidate-details/candidate-details.selector';

interface CandidateDetailsPageState {
  name: string;
  time: string;
  details: Details;
  business: Business;
}

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.page.html',
  styleUrls: ['./candidate-details.page.scss'],
})
export class CandidateDetailsPage implements OnInit {
  pageState: CandidateDetailsPageState;
  slot: TestSlot;
  slotChanged: boolean = false;
  testCategory: TestCategory = null;

  constructor(
    public modalController: ModalController,
    public navParams: NavParams,
    public store$: Store<StoreModel>,
  ) {
  }

  ngOnInit(): void {
    this.slot = this.navParams.get('slot');
    this.slotChanged = this.navParams.get('slotChanged');
    setTimeout(() => {
      this.store$.dispatch(journalActions.ClearChangedSlot({ slotId: this.slot.slotDetail.slotId }));
    });

    this.pageState = {
      name: getCandidateName(this.slot),
      time: getTime(this.slot),
      details: getDetails(this.slot),
      business: getBusiness(this.slot),
    };

    this.testCategory = this.pageState.details.testCategory as TestCategory;

    if (this.slotChanged) {
      this.store$.dispatch(candidateDetailActions.CandidateDetailsSlotChangeViewed(
        { slotId: this.slot.slotDetail.slotId },
      ));
    }
    setTimeout(() => {
      this.store$.dispatch(journalActions.ClearChangedSlot({ slotId: this.slot.slotDetail.slotId }));
    });
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(candidateDetailActions.CandidateDetailsViewDidEnter({ slot: this.slot }));
    this.store$.dispatch(journalActions.CandidateDetailsSeen({ slotId: this.slot.slotDetail.slotId }));
  }

  public specialNeedsIsPopulated(specialNeeds: string | string[]): boolean {
    return Array.isArray(specialNeeds);
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

}
