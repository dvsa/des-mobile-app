import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks, waitForAsync } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { AppLauncher, OpenURLResult } from '@capacitor/app-launcher';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSamErrorModal } from '@components/common/exit-sam/exit-sam-error-modal/exit-sam-error-modal';
import { ExitSamError } from '@components/common/test-flow-header/exit-sam.actions';
import {
  ExitSAMMethodUsed,
  TestFlowHeaderComponent,
} from '@components/common/test-flow-header/test-flow-header.component';
import { IonicModule } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { StoreModel } from '@shared/models/store.model';

describe('TestFlowHeaderComponent', () => {
  let component: TestFlowHeaderComponent;
  let fixture: ComponentFixture<TestFlowHeaderComponent>;
  let deviceProvider: DeviceProvider;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [IonicModule, AppModule, ComponentsModule, StoreModule.forRoot({}), TranslateModule],
      providers: [
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(TestFlowHeaderComponent);
    component = fixture.componentInstance;
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    fixture.detectChanges();
  }));

  describe('setupSubscription', () => {
    it('should re-enable single app mode on platform resume and destroy the subscription without emitting an error', fakeAsync(() => {
      component.shouldShowEscapeFromSamButton = true;

      spyOn(deviceProvider, 'enableSingleAppMode').and.resolveTo(true);
      spyOn(component, 'destroySubscription');
      spyOn(component.platform.resume, 'subscribe').and.callFake((callback) => callback());

      component.setupResumeSubscription();

      flushMicrotasks();

      expect(deviceProvider.enableSingleAppMode).toHaveBeenCalled();
      expect(component.destroySubscription).toHaveBeenCalled();
      expect(store$.dispatch).not.toHaveBeenCalledWith(ExitSamError);
    }));

    it('should dispatch error if enabling single app mode fails', fakeAsync(() => {
      component.shouldShowEscapeFromSamButton = true;
      spyOn(component.platform.resume, 'subscribe').and.callFake((callback) => callback());
      spyOn(deviceProvider, 'enableSingleAppMode').and.rejectWith(new Error('Test Error'));
      spyOn(component, 'destroySubscription');

      component.setupResumeSubscription();

      flushMicrotasks();

      expect(store$.dispatch).toHaveBeenCalledWith(
        ExitSamError('Enable single app mode error', new Error('Test Error'))
      );
    }));

    it('should dispatch error if single app mode is not enabled', fakeAsync(() => {
      component.shouldShowEscapeFromSamButton = true;
      spyOn(component.platform.resume, 'subscribe').and.callFake((callback) => callback());
      spyOn(deviceProvider, 'enableSingleAppMode').and.resolveTo(false);
      spyOn(component, 'destroySubscription');

      component.setupResumeSubscription();

      flushMicrotasks();

      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not enable single app mode', false));
    }));

    it('should not re-enable single app mode if shouldShowEscapeFromSamButton is false', async () => {
      component.shouldShowEscapeFromSamButton = false;
      spyOn(component.platform.resume, 'subscribe').and.callFake((callback) => callback());
      spyOn(deviceProvider, 'enableSingleAppMode');

      component.setupResumeSubscription();

      expect(deviceProvider.enableSingleAppMode).not.toHaveBeenCalled();
      expect(store$.dispatch).not.toHaveBeenCalledWith(ExitSamError);
    });
  });

  describe('destroySubscription', () => {
    it('should unsubscribe from resumeSubscription if it exists', () => {
      component.resumeSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
      component.destroySubscription();
      expect(component.resumeSubscription).toBeNull();
    });

    it('should do nothing if resumeSubscription does not exist', () => {
      component.resumeSubscription = null;
      component.destroySubscription();

      expect(component.resumeSubscription).toBeNull();
    });
  });

  describe('onEndTestClicked', () => {
    it('should emit endTestButtonClicked event', () => {
      spyOn(component.endTestButtonClicked, 'emit');

      component.onEndTestClicked();

      expect(component.endTestButtonClicked.emit).toHaveBeenCalled();
    });
  });

  describe('onCloseClicked', () => {
    it('should emit onCloseButtonClicked event', () => {
      spyOn(component.onCloseButtonClicked, 'emit');

      component.onCloseClicked();

      expect(component.onCloseButtonClicked.emit).toHaveBeenCalled();
    });
  });

  describe('changeExitSAMValue', () => {
    it('should change isExitSAMActivated and emit onExitSAMActivatedChanged event', () => {
      spyOn(component.onExitSAMActivatedChanged, 'emit');

      component.changeExitSAMValue(true);

      expect(component.isExitSAMActivated).toBeTrue();
      expect(component.onExitSAMActivatedChanged.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('openDESUnlockedModal', () => {
    it('should create and present DES unlocked modal', async () => {
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve(modalSpy));

      await component.openDESUnlockedModal();

      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ExitSamErrorModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        componentProps: {
          modalTitle: 'Unavailable',
          firstMessage: 'Microsoft Teams cannot be opened but DES is now unlocked.',
          secondMessage: 'You can manually open other apps on your iPad.',
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('openDESDidNotUnlockModal', () => {
    it('should create and present DES did not unlock modal', async () => {
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve(modalSpy));

      await component.openDESDidNotUnlockModal();

      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ExitSamErrorModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        componentProps: {
          modalTitle: 'Unavailable',
          firstMessage: 'Microsoft Teams cannot be opened.',
          secondMessage: 'Please follow the standard operating procedures.',
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('openPracticeModeModal', () => {
    it('should create and present practice mode modal', async () => {
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      spyOn(component.modalController, 'create').and.returnValue(Promise.resolve(modalSpy));

      await component.openPracticeModeModal();

      expect(component.modalController.create).toHaveBeenCalledWith({
        component: ExitSamErrorModal,
        cssClass: 'mes-modal-alert text-zoom-regular',
        componentProps: {
          modalTitle: 'You are in practice mode',
          firstMessage: 'Opening Microsoft Teams is unavailable in practice mode.',
        },
      });
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('handleDisableSAMFailure', () => {
    it('should log error, open DES did not unlock modal and dispatch ExitSamError', async () => {
      spyOn(component, 'openDESDidNotUnlockModal').and.callThrough();

      await component.handleDisableSAMFailure();

      expect(component.openDESDidNotUnlockModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not disable single app mode'));
    });
  });

  describe('handleTeamsNotFound', () => {
    it('should log error, open DES unlocked modal and dispatch ExitSamError', async () => {
      spyOn(component, 'openDESUnlockedModal').and.callThrough();

      await component.handleTeamsNotFound();

      expect(component.openDESUnlockedModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not find teams'));
    });
  });

  describe('handleTeamsOpenFailure', () => {
    it('should log error, open DES unlocked modal and dispatch ExitSamError', async () => {
      const openURLResult: OpenURLResult = { completed: false };
      spyOn(component, 'openDESUnlockedModal').and.returnValue(Promise.resolve());

      await component.handleTeamsOpenFailure(openURLResult);

      expect(component.openDESUnlockedModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not exit to teams', openURLResult));
    });
  });
  describe('disableSAMAndExit', () => {
    it('should emit exitSamUsed and open practice mode modal if in practice mode', async () => {
      component.isPracticeMode = true;
      spyOn(component.exitSamUsed, 'emit');
      spyOn(component, 'openPracticeModeModal').and.returnValue(Promise.resolve());

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.exitSamUsed.emit).toHaveBeenCalled();
      expect(component.openPracticeModeModal).toHaveBeenCalled();
    });

    it('should handle failure to disable single app mode', async () => {
      component.isPracticeMode = false;
      spyOn(deviceProvider, 'disableSingleAppMode').and.resolveTo(false);
      spyOn(component, 'handleDisableSAMFailure').and.callThrough();

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.handleDisableSAMFailure).toHaveBeenCalled();
    });

    it('should handle failure to find Microsoft Teams', async () => {
      component.isPracticeMode = false;
      spyOn(deviceProvider, 'disableSingleAppMode').and.resolveTo(true);
      spyOn(AppLauncher, 'canOpenUrl').and.resolveTo({ value: false });
      spyOn(component, 'handleTeamsNotFound').and.callThrough();

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.handleTeamsNotFound).toHaveBeenCalled();
    });

    it('should handle failure to open Microsoft Teams', async () => {
      component.isPracticeMode = false;
      spyOn(deviceProvider, 'disableSingleAppMode').and.resolveTo(true);
      spyOn(AppLauncher, 'canOpenUrl').and.resolveTo({ value: true });
      spyOn(AppLauncher, 'openUrl').and.resolveTo({ completed: false });
      spyOn(component, 'handleTeamsOpenFailure').and.callThrough();

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.handleTeamsOpenFailure).toHaveBeenCalledWith({ completed: false });
    });

    it('should setup subscription if Microsoft Teams opens successfully', async () => {
      component.isPracticeMode = false;
      spyOn(deviceProvider, 'disableSingleAppMode').and.resolveTo(true);
      spyOn(AppLauncher, 'canOpenUrl').and.resolveTo({ value: true });
      spyOn(AppLauncher, 'openUrl').and.resolveTo({ completed: true });
      spyOn(component, 'setupSubscription');

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.setupResumeSubscription).toHaveBeenCalled();
    });

    it('should handle error during disableSAMAndExit', async () => {
      component.isPracticeMode = false;
      spyOn(deviceProvider, 'disableSingleAppMode').and.rejectWith(new Error('Test Error'));
      spyOn(component, 'openDESDidNotUnlockModal').and.callThrough();

      await component.disableSAMAndExit(ExitSAMMethodUsed.BANNER);

      expect(component.openDESDidNotUnlockModal).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Error', new Error('Test Error')));
    });
  });
});
