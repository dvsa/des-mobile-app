import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppLauncher } from '@capacitor/app-launcher';
import { ComponentsModule } from '@components/common/common-components.module';
import { ExitSamDESLockedModal } from '@components/common/exit-sam/exit-sam-DES-locked-modal/exit-sam-DES-locked-modal';
import { ExitSamDESUnlockedModal } from '@components/common/exit-sam/exit-sam-DES-unlocked-modal/exit-sam-DES-unlocked-modal';
import { ExitSamPracticeModeModal } from '@components/common/exit-sam/exit-sam-practice-mode-modal/exit-sam-practice-mode-modal';
import { ExitSamError } from '@components/common/test-flow-header/exit-sam.actions';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { StoreModel } from '@shared/models/store.model';

describe('PageHeaderComponent', () => {
  let component: TestFlowHeaderComponent;
  let fixture: ComponentFixture<TestFlowHeaderComponent>;
  let deviceProvider: DeviceProvider;
  let modalController: ModalController;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestFlowHeaderComponent, IonicModule.forRoot(), ComponentsModule, StoreModule.forRoot({})],
      providers: [
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(TestFlowHeaderComponent);
    component = fixture.componentInstance;
    deviceProvider = TestBed.inject(DeviceProvider);
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    fixture.detectChanges();
  }));

  it('should emit endTestButtonClicked when onEndTestClicked is called', () => {
    spyOn(component.endTestButtonClicked, 'emit');
    component.onEndTestClicked();
    expect(component.endTestButtonClicked.emit).toHaveBeenCalled();
  });

  it('should emit onCloseButtonClicked when onCloseClicked is called', () => {
    spyOn(component.onCloseButtonClicked, 'emit');
    component.onCloseClicked();
    expect(component.onCloseButtonClicked.emit).toHaveBeenCalled();
  });

  it('should emit onExitSAMActivatedChanged with new value when changeExitSAMValue is called', () => {
    spyOn(component.onExitSAMActivatedChanged, 'emit');
    component.changeExitSAMValue(true);
    expect(component.onExitSAMActivatedChanged.emit).toHaveBeenCalledWith(true);
  });

  it('should open ExitSamDESUnlockedModal when openDESUnlockedModal is called', async () => {
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    await component.openDESUnlockedModal();
    expect(modalController.create).toHaveBeenCalledWith({
      component: ExitSamDESUnlockedModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
  });

  it('should open ExitSamDESLockedModal when openDESDidNotUnlockModal is called', async () => {
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    await component.openDESDidNotUnlockModal();
    expect(modalController.create).toHaveBeenCalledWith({
      component: ExitSamDESLockedModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
  });

  it('should open ExitSamPracticeModeModal when disableSAMAndExit is called in practice mode', async () => {
    component.isPracticeMode = true;
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    await component.disableSAMAndExit();
    expect(modalController.create).toHaveBeenCalledWith({
      component: ExitSamPracticeModeModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
  });

  it('should dispatch ExitSamError and open ExitSamDESUnlockedModal if AppLauncher.openUrl fails', async () => {
    spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(true));
    spyOn(AppLauncher, 'canOpenUrl').and.returnValue(Promise.resolve({ value: true }));
    spyOn(AppLauncher, 'openUrl').and.returnValue(Promise.resolve({ completed: false }));
    spyOn(store$, 'dispatch');
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    await component.disableSAMAndExit();
    expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not exit to teams', { completed: false }));
    expect(modalController.create).toHaveBeenCalledWith({
      component: ExitSamDESUnlockedModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
  });

  it('should dispatch ExitSamError and open ExitSamDESLockedModal if disableSingleAppMode fails', async () => {
    spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(false));
    spyOn(store$, 'dispatch');
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    await component.disableSAMAndExit();
    expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not disable single app mode'));
    expect(modalController.create).toHaveBeenCalledWith({
      component: ExitSamDESLockedModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
  });

  it('should dispatch ExitSamError and open ExitSamDESUnlockedModal if AppLauncher.canOpenUrl fails', async () => {
    spyOn(deviceProvider, 'disableSingleAppMode').and.returnValue(Promise.resolve(true));
    spyOn(AppLauncher, 'canOpenUrl').and.returnValue(Promise.resolve({ value: false }));
    spyOn(store$, 'dispatch');
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({ present: () => Promise.resolve() } as any));
    await component.disableSAMAndExit();
    expect(store$.dispatch).toHaveBeenCalledWith(ExitSamError('Could not find teams'));
    expect(modalController.create).toHaveBeenCalledWith({
      component: ExitSamDESUnlockedModal,
      cssClass: 'mes-modal-alert text-zoom-regular',
    });
  });
});
