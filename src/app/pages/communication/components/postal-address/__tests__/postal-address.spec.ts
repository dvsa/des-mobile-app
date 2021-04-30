import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import {
  IonicModule, NavController, NavParams, Config, Platform,
} from 'ionic-angular';
import {
  NavControllerMock, NavParamsMock, ConfigMock, PlatformMock,
} from 'ionic-mocks';
import { By } from '@angular/platform-browser';
import { TranslateModule, TranslateService, TranslateLoader } from '@ngx-translate/core';
import { configureTestSuite } from 'ng-bullet';
import { HttpClient } from '@angular/common/http';
import { PostalAddressComponent } from '../postal-address';
import { AppModule, createTranslateLoader } from '../../../../../app/app.module';
import { ComponentsModule } from '../../../../../components/common/common-components.module';
import {
  initialState as preTestDeclarationInitialState,
} from '../../../../../modules/tests/pre-test-declarations/common/pre-test-declarations.reducer';
import { AuthenticationProvider } from '../../../../../providers/authentication/authentication';
import { AuthenticationProviderMock } from '../../../../../providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '../../../../../providers/date-time/date-time';
import { DateTimeProviderMock } from '../../../../../providers/date-time/__mocks__/date-time.mock';
import * as welshTranslations from '../../../../../assets/i18n/cy.json';
import { candidateMock } from '../../../../../modules/tests/__mocks__/tests.mock';
import { StoreModel } from '../../../../../shared/models/store.model';

describe('PostalAddressComponent', () => {
  let fixture: ComponentFixture<PostalAddressComponent>;
  let component: PostalAddressComponent;
  let store$: Store<StoreModel>;
  let translate: TranslateService;

  const mockAddress = {
    addressLine1: '1 Somewhere',
    addressLine2: '2 Someplace',
    addressLine3: '3 Sometown',
    addressLine4: '4 Somecity',
    addressLine5: '5 Somecountry',
    postcode: 'AB12 3CD',
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        PostalAddressComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forFeature('tests', () => ({
          currentTest: {
            slotId: '123',
          },
          testLifecycles: {},
          startedTests: {
            123: {
              preTestDeclarations: preTestDeclarationInitialState,
              postTestDeclarations: {
                healthDeclarationAccepted: false,
                passCertificateNumberReceived: false,
                postTestSignature: '',
              },
              journalData: {
                candidate: candidateMock,
              },
              communicationPreferences: {
                updatedEmail: '',
                communicationMethod: 'Post',
              },
            },
          },
        })),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PostalAddressComponent);
    component = fixture.componentInstance;
    store$ = TestBed.get(Store);
    spyOn(store$, 'dispatch');
    translate = TestBed.get(TranslateService);
    translate.setDefaultLang('en');
  }));

  describe('DOM', () => {

    it('should display the correct address fields when address populated', () => {
      component.isPostalAddressChosen = true;
      component.postalAddress = mockAddress;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#addressLine1'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine2'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine3'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine4'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine5'))).not.toBeNull();
        expect(fixture.debugElement.query(By.css('#postcode'))).not.toBeNull();
      });
    });

    it('should display the no address fields when address is empty', () => {
      component.isPostalAddressChosen = true;
      component.postalAddress = null;
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('#addressLine1'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine2'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine3'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine4'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#addressLine5'))).toBeNull();
        expect(fixture.debugElement.query(By.css('#postcode'))).toBeNull();
      });
    });

    describe('i18n', () => {
      it('should render the component in English by default', () => {
        component.isPostalAddressChosen = true;
        component.postalAddress = mockAddress;
        fixture.detectChanges();
        expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
          .toBe('The following postal address was used when booking the test:');
      });
      it('should render the component in Welsh when its a Welsh test', (done) => {
        component.isPostalAddressChosen = true;
        component.postalAddress = mockAddress;
        translate.use('cy').subscribe(() => {
          fixture.detectChanges();
          expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim())
            .toBe(`${(<any>welshTranslations).communication.byPostDescription}:`);
          done();
        });
      });
    });
  });

  describe('formatAddress', () => {
    it('should replace all numbers with x`s', () => {
      const formatted = component.formatAddress(mockAddress);
      expect(formatted.addressLine1).toEqual('x Somewhere');
      expect(formatted.addressLine2).toEqual('x Someplace');
      expect(formatted.addressLine3).toEqual('x Sometown');
      expect(formatted.addressLine4).toEqual('x Somecity');
      expect(formatted.addressLine5).toEqual('x Somecountry');
      expect(formatted.postcode).toEqual('ABxx xCD');
    });
  });

});
