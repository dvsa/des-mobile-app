import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { ModalReturnButtonComponent } from '@components/common/modal-return-button/modal-return-button';
import { ModalController } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import * as LinkModalActions from '@pages/useful-links/components/link-modal/link-modal.actions';
import { LinkModalComponent, LinkModalEvent } from '@pages/useful-links/components/link-modal/link-modal.component';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';
import { StoreModel } from '@shared/models/store.model';
import { MockComponent } from 'ng-mocks';
import { type MockedObject, beforeEach, describe, expect, it, vi } from 'vitest';

describe('LinkModalComponent', () => {
  let fixture: ComponentFixture<LinkModalComponent>;
  let component: LinkModalComponent;
  let store$: Store<StoreModel>;
  let modalController: MockedObject<ModalController>;

  beforeEach(() => {
    const modalControllerSpy = {
      dismiss: vi.fn().mockName('ModalController.dismiss'),
    };
    const exitSAMProviderSpy = {
      attemptToDisableSAMForEscape: vi.fn().mockName('ExitSAMProvider.attemptToDisableSAMForEscape'),
    };

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        LinkModalComponent,
        MockComponent(ModalReturnButtonComponent),
        MockComponent(ModalAlertTitleComponent),
      ],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ExitSAMProvider, useValue: exitSAMProviderSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkModalComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    modalController = TestBed.inject(ModalController) as MockedObject<ModalController>;

    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onCancel', () => {
    it('should dispatch ModalCancel action and dismiss the modal with CANCEL event', async () => {
      await component.onCancel();

      expect(store$.dispatch).toHaveBeenCalledWith(LinkModalActions.ModalCancel());
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LinkModalEvent.CANCEL });
    });
  });

  describe('onContinue', () => {
    it('should dispatch ModalContinue action, open the URL, and dismiss the modal with CONTINUE event', async () => {
      component.link = {
        id: 'example-link',
        url: 'https://example.com',
        displayText: 'Example',
      };
      vi.spyOn(window, 'open').mockReturnValue(null);

      await component.onContinue();

      expect(store$.dispatch).toHaveBeenCalledWith(LinkModalActions.ModalContinue());
      expect(window.open).toHaveBeenCalledWith(component.link.url, '_blank');
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LinkModalEvent.CONTINUE });
    });
  });
});
