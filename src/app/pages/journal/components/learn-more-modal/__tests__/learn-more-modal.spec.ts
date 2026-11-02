import { UsefulLink } from '@dvsa/mes-config-schema/remote-config';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { LearnMoreModal, type RecallLinkId } from '@pages/journal/components/learn-more-modal/learn-more-modal';
import { OpenLinkProvider } from '@providers/open-link/open-link';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';
import { RecallLinkSelected, RecallModalClosed } from '@store/general/safety-recall/safety-recall.actions';

describe('LearnMoreModal', () => {
  let modalController: jasmine.SpyObj<ModalController>;
  let openLinkProvider: jasmine.SpyObj<OpenLinkProvider>;
  let urlProvider: jasmine.SpyObj<UrlProvider>;
  let store$: jasmine.SpyObj<Store<StoreModel>>;
  let component: LearnMoreModal;

  beforeEach(() => {
    modalController = jasmine.createSpyObj('ModalController', ['dismiss']);
    openLinkProvider = jasmine.createSpyObj('OpenLinkProvider', ['openLinkModal']);
    urlProvider = jasmine.createSpyObj('UrlProvider', ['getUsefulLinks']);
    store$ = jasmine.createSpyObj('Store', ['dispatch']);
    component = new LearnMoreModal(modalController, openLinkProvider, urlProvider, store$);
    spyOn(component, 'closeModal').and.callThrough();
  });

  describe('openRecallLink', () => {
    it('dispatches RecallLinkSelected, closes modal, and opens the selected recall link', async () => {
      const recallLinks: UsefulLink[] = [
        { displayText: 'Citroën', id: 'citroen-recall', url: 'https://citroen.example.com' },
        { displayText: 'DS', id: 'ds-recall', url: 'https://ds.example.com' },
        { displayText: 'Vauxhall', id: 'vauxhall-recall', url: 'https://vauxhall.example.com' },
      ];
      urlProvider.getUsefulLinks.and.returnValue(recallLinks);
      spyOn(component, 'closeModal').and.returnValue(Promise.resolve());

      for (const recallLink of recallLinks) {
        await component.openRecallLink(recallLink.id as RecallLinkId);
        expect(openLinkProvider.openLinkModal).toHaveBeenCalledWith(recallLink, false);
      }

      expect(store$.dispatch).toHaveBeenCalledWith(RecallLinkSelected());
      expect(component.closeModal).toHaveBeenCalled();
    });

    it('does not call openLinkModal if recall link does not exist', async () => {
      urlProvider.getUsefulLinks.and.returnValue([{ id: 'other-link' } as UsefulLink]);
      spyOn(component, 'closeModal').and.returnValue(Promise.resolve());

      await component.openRecallLink('citroen-recall');

      expect(openLinkProvider.openLinkModal).toHaveBeenCalledWith(undefined, false);
    });

    it('still calls openLinkModal if usefulLinks is empty', async () => {
      urlProvider.getUsefulLinks.and.returnValue([]);
      spyOn(component, 'closeModal').and.returnValue(Promise.resolve());

      await component.openRecallLink('citroen-recall');

      expect(openLinkProvider.openLinkModal).toHaveBeenCalledWith(undefined, false);
    });
  });

  describe('closeModal', () => {
    it('dispatches RecallModalClosed and dismisses the modal', async () => {
      modalController.dismiss.and.resolveTo(true);

      await component.closeModal();

      expect(store$.dispatch).toHaveBeenCalledWith(RecallModalClosed());
      expect(modalController.dismiss).toHaveBeenCalled();
    });

    it('handles modalController.dismiss rejection gracefully', async () => {
      modalController.dismiss.and.returnValue(Promise.reject('dismiss error'));

      await expectAsync(component.closeModal()).toBeRejectedWith('dismiss error');
      expect(store$.dispatch).toHaveBeenCalledWith(RecallModalClosed());
    });
  });
});
