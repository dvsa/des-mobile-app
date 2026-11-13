import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { Style } from '@capacitor/status-bar';
import { IonButton, IonButtons, IonCol, IonRouterOutlet, IonRow, IonText, NavController } from '@ionic/angular';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { StoreModel } from '@shared/models/store.model';
import { getTestCategory } from '@store/tests/category/category.reducer';
import { DeletePracticeModeTests } from '@store/tests/tests.actions';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';

enum DisplayMessage {
  PRACTICE = 'Practice mode',
  PREVIEW = 'This is a preview of a category not yet available in DES',
}

@Component({
  selector: 'practice-mode-options-bar',
  templateUrl: 'practice-mode-options-bar.html',
  styleUrls: ['practice-mode-options-bar.scss'],
  imports: [IonRow, IonCol, IonText, IonButtons, IonButton],
})
export class PracticeModeOptionsBar implements OnInit {
  @Output()
  closeExitPracticeMode = new EventEmitter<void>();

  @Input() pageName: string;

  @Input()
  practiceJournal = false;

  public displayMsg$: Observable<string>;

  constructor(
    private navController: NavController,
    private routerOutlet: IonRouterOutlet,
    private categoryWhitelistProvider: CategoryWhitelistProvider,
    private accessibilityService: AccessibilityService,
    private store$: Store<StoreModel>
  ) {}

  ngOnInit(): void {
    this.displayMsg$ = this.store$.pipe(
      select(getTests),
      select(getCurrentTest),
      // we are using getCurrentTest outside the test flow, so if there are no test in the state, then default to empty
      map((test) => test ?? {}),
      select(getTestCategory),
      take(1),
      map((category) =>
        this.practiceJournal || this.categoryWhitelistProvider.isWhiteListed(category as TestCategory)
          ? DisplayMessage.PRACTICE
          : DisplayMessage.PREVIEW
      )
    );
  }

  cancelExitPracticeMode() {
    this.closeExitPracticeMode.emit();
  }

  async exitPracticeMode(): Promise<void> {
    await this.accessibilityService.configureStatusBar(Style.Dark);
    let subscription: Subscription;
    const transition = new Promise<void>((resolve) => {
      subscription = this.routerOutlet.activateEvents
        .pipe(
          filter((component) => component === this.routerOutlet.component),
          take(1)
        )
        .subscribe(() => resolve());
    });

    try {
      const navigated = await this.navController.navigateRoot([DASHBOARD_PAGE], { replaceUrl: true });
      if (navigated) {
        // Ionic finishes destroying the test views after Angular navigation resolves.
        await transition;
        this.destroyTestSubs();
        this.store$.dispatch(DeletePracticeModeTests());
      }
    } finally {
      subscription.unsubscribe();
    }
  }

  private destroyTestSubs = (): void => {
    // As you can exit at any time from a practice test using the exit button, you might not get to the parts of the
    // code in which typically shut down the subs.

    // Waiting room to car
    wrtcDestroy$.next(null);
    // Test report
    trDestroy$.next(null);
  };
}
