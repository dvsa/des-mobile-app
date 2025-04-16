import { Component, Input } from '@angular/core';
import { UsefulLink } from '@dvsa/mes-config-schema/remote-config';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';
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
    standalone: false
})
export class LinkModalComponent {
  @Input()
  link: UsefulLink;

  @Input()
  disableSAM = false;

  constructor(
    public modalController: ModalController,
    private store$: Store<StoreModel>,
    public exitSAMProvider: ExitSAMProvider
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
    if (this.disableSAM) {
      await this.exitSAMProvider.attemptToDisableSAMForEscape();
    }

    this.store$.dispatch(LinkModalActions.ModalContinue());
    window.open(this.link.url, '_blank');
    await this.modalController.dismiss({ event: LinkModalEvent.CONTINUE });
  }
}
