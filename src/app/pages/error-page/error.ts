import { Component, Injector, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page';
import { ErrorTypes } from '@shared/models/error-message';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
  styleUrls: ['error.scss'],
})
export class ErrorPage extends LogoutBasePageComponent {

  @Input()
  public errorType: ErrorTypes;

  @Input()
  displayAsModal: boolean = false;

  constructor(
    public modalController: ModalController,
    injector: Injector,
  ) {
    super(injector);
  }

  async dismiss(): Promise<void> {
    await this.modalController.dismiss();
  }

}
