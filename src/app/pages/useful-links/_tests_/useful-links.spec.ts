import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UsefulLink } from '@dvsa/mes-config-schema/remote-config';
import { ModalController } from '@ionic/angular';
import { ActivatedRouteMock } from '@mocks/angular-mocks/activated-route.mock';
import { Store, StoreModule } from '@ngrx/store';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import { UsefulLinkSelected } from '@pages/useful-links/useful-links.actions';
import { UsefulLinksPage } from '@pages/useful-links/useful-links.page';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { OpenLinkProvider } from '@providers/open-link/open-link';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';
import { type MockedObject, beforeEach, describe, expect, it, vi } from 'vitest';

describe('UsefulLinksPage', () => {
  let component: UsefulLinksPage;
  let store$: Store<StoreModel>;
  let fixture: ComponentFixture<UsefulLinksPage>;
  let urlProvider: MockedObject<UrlProvider>;
  let modalController: MockedObject<ModalController>;

  beforeEach(() => {
    const urlProviderSpy = {
      getUsefulLinks: vi.fn().mockName('UrlProvider.getUsefulLinks'),
    };
    const modalControllerSpy = {
      create: vi.fn().mockName('ModalController.create'),
    };

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), UsefulLinksPage],
      providers: [
        { provide: UrlProvider, useValue: urlProviderSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ActivatedRoute, useClass: ActivatedRouteMock },
        { provide: LogHelper, useClass: LogHelperMock },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: OpenLinkProvider },
        Store,
        OrientationMonitorProvider,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UsefulLinksPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    urlProvider = TestBed.inject(UrlProvider) as MockedObject<UrlProvider>;
    modalController = TestBed.inject(ModalController) as MockedObject<ModalController>;

    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should populate usefulLinks with data from UrlProvider', () => {
      const mockLinks: UsefulLink[] = [
        {
          id: 'e1',
          displayText: 'example 1',
          url: 'e1',
        },
        {
          id: 'e2',
          displayText: 'example 2',
          url: 'e2',
        },
      ];
      urlProvider.getUsefulLinks.mockReturnValue(mockLinks);

      component.ngOnInit();

      expect(component.usefulLinks).toEqual(mockLinks);
    });
  });

  describe('openLinkModal', () => {
    it('should open the modal and call present', async () => {
      const mockLinks: UsefulLink[] = [
        {
          id: 'e1',
          displayText: 'DT1 guidance',
          url: 'e1',
        },
      ];

      const modalSpy = document.createElement('ion-modal');
      modalSpy.present = vi.fn().mockResolvedValue(undefined);
      modalController.create.mockReturnValue(Promise.resolve(modalSpy));

      await component.openLinkProvider.openLinkModal(mockLinks[0]);

      const displayText = mockLinks[0].displayText.replace(/ /g, '_');

      expect(store$.dispatch).toHaveBeenCalledWith(UsefulLinkSelected(displayText));
      expect(modalController.create).toHaveBeenCalled();
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('goToDashboard', () => {
    it('should navigate back to the dashboard page', () => {
      vi.spyOn(component.router, 'navigate').mockResolvedValue(true);
      component.goToDashboard();
      expect(component.router.navigate).toHaveBeenCalledWith([DASHBOARD_PAGE], { replaceUrl: true });
    });
  });
});
