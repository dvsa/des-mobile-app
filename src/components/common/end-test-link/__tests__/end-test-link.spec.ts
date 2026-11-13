import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { StoreModel } from '@shared/models/store.model';
import { EndTestLinkComponent } from '../end-test-link';

describe('EndTestLinkComponent', () => {
  let fixture: ComponentFixture<EndTestLinkComponent>;
  let component: EndTestLinkComponent;
  let store$: Store<StoreModel>;
  let modalController: ModalController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EndTestLinkComponent],
      providers: [
        provideMockStore(),
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: Router, useClass: RouterMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(EndTestLinkComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    modalController = TestBed.inject(ModalController);

    vi.spyOn(component.routerByCategory, 'navigateToPage').mockReturnValue(undefined);
    vi.spyOn(component.router, 'navigate');
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('Class', () => {
    describe('openEndTestModal', () => {
      it('should create an error modal', async () => {
        vi.spyOn(modalController, 'create').mockReturnValue(
          Promise.resolve({
            present: async () => {},
            onWillDismiss: async () => {},
          } as unknown as HTMLIonModalElement)
        );
        await component.openEndTestModal();
        expect(modalController.create).toHaveBeenCalled();
      });
    });

    describe('onCancel', () => {
      it('should call dismiss', async () => {
        await component.openEndTestModal();
        vi.spyOn(component.terminateTestModal, 'dismiss').mockReturnValue(undefined);
        await component.onCancel();
        expect(await component.terminateTestModal.dismiss).toHaveBeenCalled();
      });
    });

    describe('onTerminate', () => {
      beforeEach(() => {
        component.terminateTestModal = { dismiss: async () => true } as HTMLIonModalElement;
        component.category = TestCategory.BE;
      });
      it('should navigate straight to office when delegated', async () => {
        component.isDelegated = true;
        await component.onTerminate();
        expect(component.routerByCategory.navigateToPage).toHaveBeenCalledWith(
          TestFlowPageNames.OFFICE_PAGE,
          TestCategory.BE
        );
      });
      it('should navigate to debrief page when not delegated', async () => {
        component.isDelegated = false;
        await component.onTerminate();
        expect(component.router.navigate).toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
      });
    });
  });
});
