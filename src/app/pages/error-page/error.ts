import { Component, Injector, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';
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
  displayAsModal = false;

  constructor(
    public modalController: ModalController,
    injector: Injector,
    exitSAMProvider: ExitSAMProvider
  ) {
    super(injector, exitSAMProvider);
  }

  async dismiss(): Promise<void> {
    await this.modalController.dismiss();
  }
}
