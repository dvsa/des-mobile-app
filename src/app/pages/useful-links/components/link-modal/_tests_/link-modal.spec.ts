import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import * as LinkModalActions from '@pages/useful-links/components/link-modal/link-modal.actions';
import { LinkModalComponent, LinkModalEvent } from '@pages/useful-links/components/link-modal/link-modal.component';
import { ExitSAMProvider } from '@providers/exitSAM/exitSAM';
import { StoreModel } from '@shared/models/store.model';

describe('LinkModalComponent', () => {
  let fixture: ComponentFixture<LinkModalComponent>;
  let component: LinkModalComponent;
  let store$: Store<StoreModel>;
  let modalController: jasmine.SpyObj<ModalController>;

  beforeEach(() => {
    const modalControllerSpy = jasmine.createSpyObj('ModalController', ['dismiss']);
    const exitSAMProviderSpy = jasmine.createSpyObj('ExitSAMProvider', ['attemptToDisable']);

    TestBed.configureTestingModule({
      declarations: [LinkModalComponent],
      imports: [IonicModule, StoreModule.forRoot({})],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: ExitSAMProvider, useValue: exitSAMProviderSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkModalComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    modalController = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;

    spyOn(store$, 'dispatch');
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
        url: 'https://example.com',
        displayText: 'Example',
      };
      spyOn(window, 'open').and.callThrough();

      await component.onContinue();

      expect(store$.dispatch).toHaveBeenCalledWith(LinkModalActions.ModalContinue());
      expect(window.open).toHaveBeenCalledWith(component.link.url, '_blank');
      expect(modalController.dismiss).toHaveBeenCalledWith({ event: LinkModalEvent.CONTINUE });
    });
  });
});
