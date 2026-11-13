import { TestBed } from '@angular/core/testing';
import { UsefulLink } from '@dvsa/mes-config-schema/remote-config';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { LearnMoreModal, type RecallLinkId } from '@pages/journal/components/learn-more-modal/learn-more-modal';
import { OpenLinkProvider } from '@providers/open-link/open-link';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';
import { RecallLinkSelected, RecallModalClosed } from '@store/general/safety-recall/safety-recall.actions';
import { type MockedObject, beforeEach, describe, expect, it, vi } from 'vitest';

describe('LearnMoreModal', () => {
  let modalController: MockedObject<Pick<ModalController, 'dismiss'>>;
  let openLinkProvider: MockedObject<Pick<OpenLinkProvider, 'openLinkModal'>>;
  let urlProvider: MockedObject<Pick<UrlProvider, 'getUsefulLinks'>>;
  let store$: MockedObject<Pick<Store<StoreModel>, 'dispatch'>>;
  let component: LearnMoreModal;

  beforeEach(() => {
    modalController = {
      dismiss: vi.fn().mockName('ModalController.dismiss'),
    };
    openLinkProvider = {
      openLinkModal: vi.fn().mockName('OpenLinkProvider.openLinkModal'),
    };
    urlProvider = {
      getUsefulLinks: vi.fn().mockName('UrlProvider.getUsefulLinks'),
    };
    store$ = {
      dispatch: vi.fn().mockName('Store.dispatch'),
    };
    TestBed.configureTestingModule({
      providers: [
        LearnMoreModal,
        { provide: ModalController, useValue: modalController },
        { provide: OpenLinkProvider, useValue: openLinkProvider },
        { provide: UrlProvider, useValue: urlProvider },
        { provide: Store, useValue: store$ },
      ],
    });
    component = TestBed.inject(LearnMoreModal);
    vi.spyOn(component, 'closeModal');
  });

  describe('openRecallLink', () => {
    it('dispatches RecallLinkSelected, closes modal, and opens the selected recall link', async () => {
      const recallLinks: UsefulLink[] = [
        { displayText: 'Citroën', id: 'citroen-recall', url: 'https://citroen.example.com' },
        { displayText: 'DS', id: 'ds-recall', url: 'https://ds.example.com' },
        { displayText: 'Vauxhall', id: 'vauxhall-recall', url: 'https://vauxhall.example.com' },
      ];
      urlProvider.getUsefulLinks.mockReturnValue(recallLinks);
      vi.spyOn(component, 'closeModal').mockReturnValue(Promise.resolve());

      for (const recallLink of recallLinks) {
        await component.openRecallLink(recallLink.id as RecallLinkId);
        expect(openLinkProvider.openLinkModal).toHaveBeenCalledWith(recallLink, false);
      }

      expect(store$.dispatch).toHaveBeenCalledWith(RecallLinkSelected());
      expect(component.closeModal).toHaveBeenCalled();
    });

    it('does not call openLinkModal if recall link does not exist', async () => {
      urlProvider.getUsefulLinks.mockReturnValue([{ id: 'other-link' } as UsefulLink]);
      vi.spyOn(component, 'closeModal').mockReturnValue(Promise.resolve());

      await component.openRecallLink('citroen-recall');

      expect(openLinkProvider.openLinkModal).toHaveBeenCalledWith(undefined, false);
    });

    it('still calls openLinkModal if usefulLinks is empty', async () => {
      urlProvider.getUsefulLinks.mockReturnValue([]);
      vi.spyOn(component, 'closeModal').mockReturnValue(Promise.resolve());

      await component.openRecallLink('citroen-recall');

      expect(openLinkProvider.openLinkModal).toHaveBeenCalledWith(undefined, false);
    });
  });

  describe('closeModal', () => {
    it('dispatches RecallModalClosed and dismisses the modal', async () => {
      modalController.dismiss.mockResolvedValue(true);

      await component.closeModal();

      expect(store$.dispatch).toHaveBeenCalledWith(RecallModalClosed());
      expect(modalController.dismiss).toHaveBeenCalled();
    });

    it('handles modalController.dismiss rejection gracefully', async () => {
      modalController.dismiss.mockReturnValue(Promise.reject('dismiss error'));

      await expect(component.closeModal()).rejects.toEqual('dismiss error');
      expect(store$.dispatch).toHaveBeenCalledWith(RecallModalClosed());
    });
  });
});
