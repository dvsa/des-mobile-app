import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonRouterOutlet, NavController } from '@ionic/angular';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { CategoryWhitelistProvider } from '@providers/category-whitelist/category-whitelist';
import { trDestroy$ } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { wrtcDestroy$ } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { DeletePracticeModeTests } from '@store/tests/tests.actions';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { unitTestErrorCause } from '../../../../test-setup.vitest';
import { PracticeModeOptionsBar } from '../practice-mode-options-bar';

describe('PracticeModeOptionsBar', () => {
  let fixture: ComponentFixture<PracticeModeOptionsBar>;
  let component: PracticeModeOptionsBar;
  let navigateRoot: Mock;
  let activateEvents: EventEmitter<object>;
  let dashboard: object;
  let store$: MockStore;

  beforeEach(() => {
    navigateRoot = vi.fn().mockResolvedValue(true);
    activateEvents = new EventEmitter<object>();
    dashboard = {};
    TestBed.configureTestingModule({
      imports: [PracticeModeOptionsBar],
      providers: [
        {
          provide: NavController,
          useValue: { navigateRoot },
        },
        {
          provide: IonRouterOutlet,
          useValue: { activateEvents, component: dashboard },
        },
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
        CategoryWhitelistProvider,
        provideMockStore({}),
      ],
    });

    fixture = TestBed.createComponent(PracticeModeOptionsBar);
    component = fixture.componentInstance;
    store$ = TestBed.inject(MockStore);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('exitPracticeMode', () => {
    it('should clear practice tests only after the dashboard transition finishes', async () => {
      const exit = component.exitPracticeMode();
      await vi.waitFor(() => expect(navigateRoot).toHaveBeenCalled());

      expect(navigateRoot).toHaveBeenCalledWith([DASHBOARD_PAGE], { replaceUrl: true });
      expect(store$.dispatch).not.toHaveBeenCalled();

      activateEvents.emit(dashboard);
      await exit;
      expect(store$.dispatch).toHaveBeenCalledWith(DeletePracticeModeTests());
    });

    it('should ignore an earlier page transition still finishing', async () => {
      const exit = component.exitPracticeMode();
      await vi.waitFor(() => expect(navigateRoot).toHaveBeenCalled());
      activateEvents.emit({});
      await Promise.resolve();
      expect(store$.dispatch).not.toHaveBeenCalled();

      activateEvents.emit(dashboard);
      await exit;
      expect(store$.dispatch).toHaveBeenCalledWith(DeletePracticeModeTests());
    });

    it('should retain practice tests when navigation is cancelled', async () => {
      navigateRoot.mockResolvedValue(false);
      await component.exitPracticeMode();
      activateEvents.emit(dashboard);
      expect(store$.dispatch).not.toHaveBeenCalled();
    });

    it('should retain practice tests and propagate navigation failures', async () => {
      const error = new Error('Navigation failed', { cause: unitTestErrorCause });
      navigateRoot.mockRejectedValue(error);
      await expect(component.exitPracticeMode()).rejects.toEqual(error);
      activateEvents.emit(dashboard);
      expect(store$.dispatch).not.toHaveBeenCalled();
    });

    it('should signal subscription cleanup on every practice exit', async () => {
      const testReportCleanup = vi.fn();
      const waitingRoomCleanup = vi.fn();
      const testReportSubscription = trDestroy$.subscribe(testReportCleanup);
      const waitingRoomSubscription = wrtcDestroy$.subscribe(waitingRoomCleanup);
      try {
        for (let i = 0; i < 2; i++) {
          const exit = component.exitPracticeMode();
          await vi.waitFor(() => expect(navigateRoot).toHaveBeenCalledTimes(i + 1));
          activateEvents.emit(dashboard);
          await exit;
        }
        expect(testReportCleanup).toHaveBeenCalledTimes(2);
        expect(waitingRoomCleanup).toHaveBeenCalledTimes(2);
      } finally {
        testReportSubscription.unsubscribe();
        waitingRoomSubscription.unsubscribe();
      }
    });
  });
});
