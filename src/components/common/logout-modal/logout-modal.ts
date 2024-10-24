import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { Observable } from 'rxjs';

export enum LogoutModalEvent {
  LOGOUT = 'logout',
  CANCEL = 'cancel',
}

@Component({
  selector: 'logout-modal',
  templateUrl: './logout-modal.html',
  styleUrls: ['./logout-modal.scss'],
})
export class LogoutModal {
  constructor(public modalController: ModalController) {}

  @Input()
  testStatuses: Observable<{ [slotId: string]: TestStatus }>;

  getUnsubmittedTestsCount(): number {
    let count = 0;
    this.testStatuses
      .subscribe((testStatuses) => {
        count = Object.values(testStatuses).filter((key: TestStatus) => key === TestStatus.Completed).length;
      })
      .unsubscribe();
    return count;
  }

  async onCancel() {
    await this.modalController.dismiss({ event: LogoutModalEvent.CANCEL });
  }
  async onLogout() {
    await this.modalController.dismiss({ event: LogoutModalEvent.LOGOUT });
  }
}
