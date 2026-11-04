import { Component, Injector, Input } from '@angular/core';
import { ErrorMessageComponent } from '@components/common/error-message/error-message';
import { IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, ModalController } from '@ionic/angular';
import { LogoutBasePageComponent } from '@shared/classes/logout-base-page/logout-base-page';
import { ErrorTypes } from '@shared/models/error-message';

@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
  styleUrls: ['error.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, ErrorMessageComponent],
})
export class ErrorPage extends LogoutBasePageComponent {
  @Input()
  public errorType: ErrorTypes;

  @Input()
  displayAsModal = false;

  constructor(
    public modalController: ModalController,
    injector: Injector
  ) {
    super(injector);
  }

  async dismiss(): Promise<void> {
    await this.modalController.dismiss();
  }
}
