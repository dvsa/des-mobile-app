import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { Store, StoreModule } from '@ngrx/store';
import { ScreenOrientation } from '@capawesome/capacitor-screen-orientation';
import { provideMockStore } from '@ngrx/store/testing';

import { AppModule } from '@app/app.module';
import { StoreModel } from '@shared/models/store.model';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { BasePageComponent } from '@shared/classes/base-page';
import { JOURNAL_PAGE } from '@pages/page-names.constants';
import { MOCK_STORE_INITIAL_STATE } from '@mocks/state/initial-state';
import { BackToOfficePage, NavigationTarget } from '../back-to-office.page';

describe('BackToOfficePage', () => {
  let fixture: ComponentFixture<BackToOfficePage>;
  let component: BackToOfficePage;
  let modalController: ModalController;
  let store$: Store<StoreModel>;
  let insomnia: Insomnia;
  let deviceProvider: DeviceProvider;
  let routeByCat: RouteByCategoryProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BackToOfficePage,
        MockComponent(PracticeModeBanner),
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        {
          provide: Insomnia,
          useClass: InsomniaMock,
        },
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
        {
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        provideMockStore({ initialState: MOCK_STORE_INITIAL_STATE }),
      ],
    });

    fixture = TestBed.createComponent(BackToOfficePage);
    component = fixture.componentInstance;
    insomnia = TestBed.inject(Insomnia);
    deviceProvider = TestBed.inject(DeviceProvider);
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    routeByCat = TestBed.inject(RouteByCategoryProvider);
    spyOn(store$, 'dispatch');
    spyOn(BasePageComponent.prototype, 'isIos')
      .and
      .returnValue(true);
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions when in practice mode', async () => {
        spyOn(ScreenOrientation, 'unlock');
        await component.ionViewDidEnter();
        expect(deviceProvider.disableSingleAppMode)
          .not
          .toHaveBeenCalled();
        expect(ScreenOrientation.unlock)
          .toHaveBeenCalled();
        expect(insomnia.allowSleepAgain)
          .toHaveBeenCalled();
      });
    });

    describe('navigateForward', () => {
      it('should display modal and call onContinue with office when singleAppModeEnabled is false', async () => {
        component.singleAppModeEnabled = false;
        spyOn(modalController, 'create')
          .and
          .returnValue(Promise.resolve({
            present: async () => {
            },
            onDidDismiss: () => {
            },
          } as HTMLIonModalElement));
        spyOn(component, 'onContinue');
        await component.navigateForward(NavigationTarget.OFFICE);
        expect(modalController.create)
          .toHaveBeenCalledTimes(1);
        expect(component.onContinue)
          .toHaveBeenCalledWith(NavigationTarget.OFFICE);
      });

      // eslint-disable-next-line max-len
      it('should NOT display modal, but still call onContinue with office when singleAppModeEnabled is true', async () => {
        component.singleAppModeEnabled = true;
        spyOn(modalController, 'create')
          .and
          .returnValue(Promise.resolve({
            present: async () => {
            },
            onDidDismiss: () => {
            },
          } as HTMLIonModalElement));
        spyOn(component, 'onContinue');
        await component.navigateForward(NavigationTarget.OFFICE);
        expect(modalController.create)
          .toHaveBeenCalledTimes(0);
        expect(component.onContinue)
          .toHaveBeenCalledWith(NavigationTarget.OFFICE);
      });
    });

    describe('onContinue', () => {
      it('should call goToOfficePage when office is passed in', async () => {
        spyOn(component, 'goToOfficePage');
        await component.onContinue(NavigationTarget.OFFICE);
        expect(component.goToOfficePage)
          .toHaveBeenCalled();
      });

      it('should call goToJournal when journal is passed in', async () => {
        spyOn(component, 'goToJournal');
        await component.onContinue(NavigationTarget.JOURNAL);
        expect(component.goToJournal)
          .toHaveBeenCalled();
      });
    });

    describe('goToJournal', () => {
      it('should call through to route by cat provider and nav to JOURNAL_PAGE', async () => {
        spyOn(routeByCat, 'navigateToPage')
          .and
          .returnValue(Promise.resolve());
        await component.goToJournal();
        expect(routeByCat.navigateToPage)
          .toHaveBeenCalledWith(JOURNAL_PAGE, null, { replaceUrl: true });
      });
      it('should call the popTo method in the navcontroller if in practice mode', async () => {
        component.isEndToEndPracticeMode = true;
        spyOn(component, 'exitPracticeMode');
        await component.goToJournal();
        expect(component.exitPracticeMode)
          .toHaveBeenCalled();
      });
    });
  });

  // describe('DOM', () => {
  //   it('should show the return to journal button when not a rekey', () => {
  //     fixture.detectChanges();
  //     expect(fixture.debugElement.query(By.css('.bottom-button')))
  //       .toBeDefined();
  //   });
  //   it('should hide the return to journal button when this is a rekey', () => {
  //     fixture.detectChanges();
  //     component.pageState.isRekey$ = of(true);
  //     fixture.detectChanges();
  //     expect(fixture.debugElement.query(By.css('.bottom-button')))
  //       .toBeNull();
  //   });
  // });
});
