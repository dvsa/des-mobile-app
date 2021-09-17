import { ModalController, NavController, Platform } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { OfficeBasePageComponent } from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'finish-test-modal',
  templateUrl: './finish-test-modal.html',
  styleUrls: ['./finish-test-modal.scss'],
})
export class FinishTestModal extends OfficeBasePageComponent implements OnInit {

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    navController: NavController,
    public modalController: ModalController,
  ) {
    super(platform, authenticationProvider, router, store$, navController);
  }

  ngOnInit(): void {
  }

  onCompleteTest = async () => {
    await this.modalController.dismiss();
    await this.completeTest();
  };

  onBack = async () => {
    await this.modalController.dismiss();
  };
}
