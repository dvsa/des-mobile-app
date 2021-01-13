import { Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../shared/models/store.model';

@Component({
  selector: 'practice-test-report-card',
  templateUrl: 'practice-test-report-card.html',
  styleUrls: ['practice-test-report-card.scss'],
})

export class PracticeTestReportCardComponent {

  constructor(
    private store$: Store<StoreModel>,
    public alertController: AlertController,
    private modalController: ModalController,
  ) { }

  showDrivingFaultModal = (): void => {
    console.log('Practice test modal to be implemented');
  };

  onModalDismiss = (): void => {
    console.log('Practice test modal dismiss to be implemented');
  };

}
