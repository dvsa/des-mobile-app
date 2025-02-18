import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ActivatedRouteMock } from '@mocks/angular-mocks/activated-route.mock';
import { Store, StoreModule } from '@ngrx/store';
import { DASHBOARD_PAGE } from '@pages/page-names.constants';
import * as UsefulLinkActions from '@pages/useful-links/useful-links.actions';
import { UsefulLinkNames } from '@pages/useful-links/useful-links.model';
import { UsefulLinksPage } from '@pages/useful-links/useful-links.page';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { OrientationMonitorProvider } from '@providers/orientation-monitor/orientation-monitor.provider';
import { UrlProvider } from '@providers/url/url';
import { StoreModel } from '@shared/models/store.model';

describe('UsefulLinksPage', () => {
  let component: UsefulLinksPage;
  let store$: Store<StoreModel>;
  let fixture: ComponentFixture<UsefulLinksPage>;
  let urlProvider: jasmine.SpyObj<UrlProvider>;
  let modalController: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    const urlProviderSpy = jasmine.createSpyObj('UrlProvider', ['getUsefulLinks']);
    const modalControllerSpy = jasmine.createSpyObj('ModalController', ['create']);

    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [UsefulLinksPage],
      providers: [
        { provide: UrlProvider, useValue: urlProviderSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: ActivatedRoute, useClass: ActivatedRouteMock },
        { provide: LogHelper, useClass: LogHelperMock },
        { provide: ModalController, useValue: modalControllerSpy },
        Store,
        OrientationMonitorProvider,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UsefulLinksPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    urlProvider = TestBed.inject(UrlProvider) as jasmine.SpyObj<UrlProvider>;
    modalController = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;

    spyOn(store$, 'dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should populate usefulLinks with data from UrlProvider', () => {
      const mockLinks = {
        drivingExaminationGuidanceURL: 'http://example.com/dt1',
        accessibilityStatementURL: 'http://example.com/accessibility',
      };
      urlProvider.getUsefulLinks.and.returnValue(mockLinks);

      component.ngOnInit();

      expect(component.usefulLinks).toEqual([
        {
          name: UsefulLinkNames.drivingExaminationGuidanceURL,
          url: 'http://example.com/dt1',
          actionName: 'DT1Guidance',
        },
        {
          name: UsefulLinkNames.accessibilityStatementURL,
          url: 'http://example.com/accessibility',
          actionName: 'AccessibilityStatement',
        },
      ]);
    });
  });

  describe('openLinkModal', () => {
    it('should open the modal and call present', async () => {
      const url = 'https://example.com';
      const actionName = 'DT1Guidance';
      const modalSpy = jasmine.createSpyObj('HTMLIonModalElement', ['present']);
      modalController.create.and.returnValue(Promise.resolve(modalSpy));

      await component.openLinkModal(url, actionName);

      expect(store$.dispatch).toHaveBeenCalledWith(UsefulLinkActions.DT1GuidanceSelected());
      expect(modalController.create).toHaveBeenCalled();
      expect(modalSpy.present).toHaveBeenCalled();
    });
  });

  describe('goToDashboard', () => {
    it('should navigate back to the dashboard page', () => {
      spyOn(component.router, 'navigate').and.callThrough();
      component.goToDashboard();
      expect(component.router.navigate).toHaveBeenCalledWith([DASHBOARD_PAGE], { replaceUrl: true });
    });
  });
});
