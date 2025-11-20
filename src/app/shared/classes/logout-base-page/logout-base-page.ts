import { Injector } from '@angular/core';
import { LogoutModal, LogoutModalEvent } from '@components/common/logout-modal/logout-modal';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { select } from '@ngrx/store';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import {
  LogoutCancelled,
  LogoutConfirmed,
  LogoutModalChanged,
} from '@shared/classes/logout-base-page/logout-base-page.actions';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { getTests } from '@store/tests/tests.reducer';
import { getTestStatuses } from '@store/tests/tests.selector';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { BasePageComponent } from '../base-page';

export abstract class LogoutBasePageComponent extends BasePageComponent {
  protected modalController = this.injector.get(ModalController);
  protected accessibilityService = this.injector.get(AccessibilityService);

  previousUploadedTestCount = 0;

  protected constructor(injector: Injector) {
    super(injector);
  }

  async openLogoutModal() {
    const unuploadedTestCount: Observable<number> = this.store$.select(getTests).pipe(
      select(getTestStatuses),
      map((statuses) => {
        return Object.values(statuses).filter((testStasus: TestStatus) => {
          return testStasus === TestStatus.Completed;
        }).length;
      })
    );

    unuploadedTestCount
      .pipe(take(1))
      .subscribe((value) => (this.previousUploadedTestCount = value))
      .unsubscribe();

    unuploadedTestCount.subscribe((count) => {
      if (count !== this.previousUploadedTestCount) {
        this.store$.dispatch(LogoutModalChanged(count));
      }
      this.previousUploadedTestCount = count;
    });

    const modal: HTMLIonModalElement = await this.modalController.create({
      id: 'logOutModal',
      component: LogoutModal,
      componentProps: {
        unuploadedTestCount: unuploadedTestCount,
      },
      cssClass: `${this.accessibilityService.getTextZoomClass()} mes-modal-alert`,
      backdropDismiss: false,
      showBackdrop: true,
    });
    await modal.present();
    const { data }: OverlayEventDetail = await modal.onDidDismiss<LogoutModalEvent>();
    if (data.event === LogoutModalEvent.LOGOUT) {
      unuploadedTestCount.pipe(take(1)).subscribe((value) => this.store$.dispatch(LogoutConfirmed(value)));
      await this.logout();
    } else {
      unuploadedTestCount.pipe(take(1)).subscribe((value) => this.store$.dispatch(LogoutCancelled(value)));
    }
  }
}
