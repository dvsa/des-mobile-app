import { Component, Input } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import * as LinkModalActions from './link-modal.actions';

export enum LinkModalEvent {
  CONTINUE = 'continue',
  CANCEL = 'cancel',
}

@Component({
  selector: 'link-modal',
  templateUrl: './link-modal.component.html',
  styleUrls: ['./link-modal.component.scss'],
})
export class LinkModalComponent {
  @Input()
  link: string;

  @Input()
  actionName: string;

  constructor(
    public modalController: ModalController,
    private store$: Store<StoreModel>
  ) {}

  async onCancel() {
    this.store$.dispatch(LinkModalActions.ModalCancel());
    await this.modalController.dismiss({ event: LinkModalEvent.CANCEL });
  }

  /**
   * Continue to the link and dispatch the corresponding action
   * Gets the Link name from the actionName prop and appends the word selected, in order to target the action
   * Due to this any additional actions that come as a result of new links being added, must have the word Selected appended to the action name
   */
  async onContinue() {
    this.store$.dispatch(LinkModalActions.ModalContinue());
    await Browser.open({ url: this.link, toolbarColor: '#000000' });
    await this.modalController.dismiss({ event: LinkModalEvent.CONTINUE });
  }
}
