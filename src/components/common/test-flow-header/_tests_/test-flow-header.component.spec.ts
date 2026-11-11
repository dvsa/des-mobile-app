import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppLauncher, OpenURLResult } from '@capacitor/app-launcher';
import { ExitSAMConfirmButtonClicked, ExitSamError } from '@components/common/test-flow-header/exit-sam.actions';
import {
  ExitSAMMethodUsed,
  TestFlowHeaderComponent,
} from '@components/common/test-flow-header/test-flow-header.component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store, StoreModule } from '@ngrx/store';

import { DeviceProvider } from '@providers/device/device';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { StoreModel } from '@shared/models/store.model';

describe('TestFlowHeaderComponent', () => {
  let component: TestFlowHeaderComponent;
  let fixture: ComponentFixture<TestFlowHeaderComponent>;
  let deviceProvider: DeviceProvider;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        provideBasePageMocks(),
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock }, // ADD THIS
      ],
    });

    fixture = TestBed.createComponent(TestFlowHeaderComponent);
    component = fixture.componentInstance;
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    fixture.detectChanges();
  });

  describe('onEndTestClicked', () => {
    it('should emit endTestButtonClicked event', () => {
      vi.spyOn(component.endTestButtonClicked, 'emit').mockReturnValue(undefined);

      component.onEndTestClicked();

      expect(component.endTestButtonClicked.emit).toHaveBeenCalled();
    });
  });

  describe('onCloseClicked', () => {
    it('should emit onCloseButtonClicked event', () => {
      vi.spyOn(component.onCloseButtonClicked, 'emit').mockReturnValue(undefined);

      component.onCloseClicked();

      expect(component.onCloseButtonClicked.emit).toHaveBeenCalled();
    });
  });

  describe('changeExitSAMValue', () => {
    it('should change isExitSAMActivated and emit onExitSAMActivatedChanged event', () => {
      vi.spyOn(component.onExitSAMActivatedChanged, 'emit').mockReturnValue(undefined);

      component.changeExitSAMValue(true);

      expect(component.isExitSAMActivated).toBe(true);
      expect(component.onExitSAMActivatedChanged.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('openDESUnlockedModal', () => {
    it('should create and present DES unlocked modal', async () => {
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());

      await component.openDESUnlockedModal();

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalledWith(
        'Microsoft Teams cannot be opened but DES is now unlocked.',
        'You can manually open other apps on your iPad.'
      );
    });
  });

  describe('openDESDidNotUnlockModal', () => {
    it('should call exitSAMProvider.openExitSamErrorModal with correct messages', async () => {
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());

      await component.openDESDidNotUnlockModal();

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalledWith(
        'Microsoft Teams cannot be opened.',
        'Please follow the standard operating procedures.'
      );
    });
  });

  describe('handleDisableSAMFailure', () => {
    it('should log error, open DES did not unlock modal and dispatch ExitSamError', async () => {
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());

      await component.handleDisableSAMFailure();

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not disable single app mode'));
    });
  });

  describe('handleTeamsNotFound', () => {
    it('should log error, open DES unlocked modal and dispatch ExitSamError', async () => {
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());

      await component.handleTeamsNotFound();

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not find teams'));
    });
  });

  describe('handleTeamsOpenFailure', () => {
    it('should log error, open DES unlocked modal and dispatch ExitSamError', async () => {
      const openURLResult: OpenURLResult = { completed: false };
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());

      await component.handleTeamsOpenFailure(openURLResult);

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not exit to teams', openURLResult));
    });
  });

  describe('disableSAMAndExit', () => {
    it('should handle failure to disable single app mode', async () => {
      component.isPracticeMode = false;
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockResolvedValue(false);
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());
      vi.spyOn(component.setupResumeSubscription, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.setupLeaveSubscription, 'emit').mockReturnValue(undefined);

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSAMConfirmButtonClicked(ExitSAMMethodUsed.BANNER));
      expect(component.setupResumeSubscription.emit).not.toHaveBeenCalled();
      expect(component.setupLeaveSubscription.emit).not.toHaveBeenCalled();
    });

    it('should handle failure to find Microsoft Teams', async () => {
      component.isPracticeMode = false;
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockResolvedValue(true);
      vi.spyOn(AppLauncher, 'canOpenUrl').mockResolvedValue({ value: false });
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());
      vi.spyOn(component.setupResumeSubscription, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.setupLeaveSubscription, 'emit').mockReturnValue(undefined);

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalled();
      expect(component.setupResumeSubscription.emit).not.toHaveBeenCalled();
      expect(component.setupLeaveSubscription.emit).toHaveBeenCalled();
    });

    it('should handle failure to open Microsoft Teams', async () => {
      component.isPracticeMode = false;
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockResolvedValue(true);
      vi.spyOn(AppLauncher, 'canOpenUrl').mockResolvedValue({ value: true });
      vi.spyOn(AppLauncher, 'openUrl').mockResolvedValue({ completed: false });
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());
      vi.spyOn(component.setupResumeSubscription, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.setupLeaveSubscription, 'emit').mockReturnValue(undefined);

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalled();
      expect(component.setupResumeSubscription.emit).not.toHaveBeenCalled();
      expect(component.setupLeaveSubscription.emit).toHaveBeenCalled();
    });

    it('should set up the resume subscription when Teams opens successfully', async () => {
      component.isPracticeMode = false;
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockResolvedValue(true);
      vi.spyOn(AppLauncher, 'canOpenUrl').mockResolvedValue({ value: true });
      vi.spyOn(AppLauncher, 'openUrl').mockResolvedValue({ completed: true });
      vi.spyOn(component.setupResumeSubscription, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.setupLeaveSubscription, 'emit').mockReturnValue(undefined);

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.setupResumeSubscription.emit).toHaveBeenCalled();
      expect(component.setupLeaveSubscription.emit).not.toHaveBeenCalled();
    });

    it('should set up the leave subscription when checking whether Teams can open throws', async () => {
      component.isPracticeMode = false;
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockResolvedValue(true);
      vi.spyOn(AppLauncher, 'canOpenUrl').mockRejectedValue(new Error('Launcher unavailable'));
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());
      vi.spyOn(component.setupLeaveSubscription, 'emit').mockReturnValue(undefined);

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.setupLeaveSubscription.emit).toHaveBeenCalled();
    });

    it('should set up the leave subscription when opening Teams throws', async () => {
      component.isPracticeMode = false;
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockResolvedValue(true);
      vi.spyOn(AppLauncher, 'canOpenUrl').mockResolvedValue({ value: true });
      vi.spyOn(AppLauncher, 'openUrl').mockRejectedValue(new Error('Launcher unavailable'));
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());
      vi.spyOn(component.setupLeaveSubscription, 'emit').mockReturnValue(undefined);

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.setupLeaveSubscription.emit).toHaveBeenCalled();
    });

    it('should handle error during disableSAMAndExit', async () => {
      component.isPracticeMode = false;
      vi.spyOn(deviceProvider, 'disableSingleAppMode').mockRejectedValue(new Error('Test Error'));
      vi.spyOn(component.exitSAMProvider, 'openExitSamErrorModal').mockReturnValue(Promise.resolve());
      vi.spyOn(component.setupResumeSubscription, 'emit').mockReturnValue(undefined);
      vi.spyOn(component.setupLeaveSubscription, 'emit').mockReturnValue(undefined);

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.exitSAMProvider.openExitSamErrorModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Error', new Error('Test Error')));
      expect(component.setupResumeSubscription.emit).not.toHaveBeenCalled();
      expect(component.setupLeaveSubscription.emit).not.toHaveBeenCalled();
    });
  });
});
