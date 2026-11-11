import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { ModalController } from '@ionic/angular';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { JOURNAL_PAGE } from '@pages/page-names.constants';

import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';

import { BackToOfficePage, NavigationTarget } from '../back-to-office.page';

describe('BackToOfficePage', () => {
  let fixture: ComponentFixture<BackToOfficePage>;
  let component: BackToOfficePage;
  let modalController: ModalController;
  let store$: Store<StoreModel>;
  let routeByCategoryProvider: RouteByCategoryProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MockComponent(TestFlowHeaderComponent), BackToOfficePage, MockComponent(PracticeModeOptionsBar)],
      providers: [
        provideBasePageMocks(),
        provideMockStore({
          initialState: {
            appInfo: { versionNumber: '' },
            tests: {
              currentTest: { slotId: 'test-slot' },
              startedTests: {
                'test-slot': { category: undefined, delegatedTest: false, rekey: false },
              },
              testStatus: {},
            },
          } as unknown as StoreModel,
        }),
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(BackToOfficePage);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    routeByCategoryProvider = TestBed.inject(RouteByCategoryProvider);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    vi.spyOn(routeByCategoryProvider, 'navigateToPage').mockReturnValue(Promise.resolve());
    vi.spyOn(BasePageComponent.prototype, 'isIos').mockReturnValue(true);
  });

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions when in practice mode', async () => {
        vi.spyOn(BasePageComponent.prototype, 'unlockDevice').mockReturnValue(undefined);
        await component.ionViewDidEnter();
        expect(BasePageComponent.prototype.unlockDevice).toHaveBeenCalled();
      });
    });

    describe('navigateForward', () => {
      it('should display modal and call onContinue with office when singleAppModeEnabled is false', async () => {
        component.singleAppModeEnabled = false;
        vi.spyOn(modalController, 'create').mockReturnValue(
          Promise.resolve({
            present: async () => {},
            onDidDismiss: () => {},
          } as HTMLIonModalElement)
        );
        vi.spyOn(component, 'onContinue').mockReturnValue(undefined);
        await component.navigateForward(NavigationTarget.OFFICE);
        expect(modalController.create).toHaveBeenCalledTimes(1);
        expect(component.onContinue).toHaveBeenCalledWith(NavigationTarget.OFFICE);
      });

      // eslint-disable-next-line max-len
      it('should NOT display modal, but still call onContinue with office when singleAppModeEnabled is true', async () => {
        component.singleAppModeEnabled = true;
        vi.spyOn(modalController, 'create').mockReturnValue(
          Promise.resolve({
            present: async () => {},
            onDidDismiss: () => {},
          } as HTMLIonModalElement)
        );
        vi.spyOn(component, 'onContinue').mockReturnValue(undefined);
        await component.navigateForward(NavigationTarget.OFFICE);
        expect(modalController.create).toHaveBeenCalledTimes(0);
        expect(component.onContinue).toHaveBeenCalledWith(NavigationTarget.OFFICE);
      });
    });

    describe('onContinue', () => {
      it('should call goToOfficePage when office is passed in', () => {
        vi.spyOn(component, 'goToOfficePage').mockReturnValue(undefined);
        component.onContinue(NavigationTarget.OFFICE);
        expect(component.goToOfficePage).toHaveBeenCalled();
      });

      it('should call goToJournal when journal is passed in', () => {
        vi.spyOn(component, 'goToJournal').mockReturnValue(undefined);
        component.onContinue(NavigationTarget.JOURNAL);
        expect(component.goToJournal).toHaveBeenCalled();
      });
    });

    describe('goToJournal', () => {
      it('should call through to navigateToPage with replaceUrl', async () => {
        await component.goToJournal();
        expect(routeByCategoryProvider.navigateToPage).toHaveBeenCalledWith(JOURNAL_PAGE, null, { replaceUrl: true });
      });
      it('should call the popTo method in the navcontroller if in practice mode', async () => {
        component.isEndToEndPracticeMode = true;
        vi.spyOn(component, 'exitPracticeMode').mockReturnValue(undefined);
        await component.goToJournal();
        expect(component.exitPracticeMode).toHaveBeenCalled();
      });
    });
  });

  describe('DOM', () => {
    it('should show the return to journal button when not a rekey', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.bottom-button'))).toBeDefined();
    });
    it('should hide the return to journal button when this is a rekey', () => {
      fixture.detectChanges();
      component.isRekey = true;
      fixture.changeDetectorRef.markForCheck();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.bottom-button'))).toBeNull();
    });
  });
});
