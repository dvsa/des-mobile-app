import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { Subscription, of } from 'rxjs';

import { AppModule } from '@app/app.module';
import { JOURNAL_PAGE, REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { RekeyUploadOutcomeViewDidEnter } from '@pages/rekey-upload-outcome/rekey-upload-outcome.actions';
import { RekeyUploadOutcomePage } from '@pages/rekey-upload-outcome/rekey-upload-outcome.page';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { rekeyReasonReducer } from '../../rekey-reason/rekey-reason.reducer';

describe('RekeyUploadOutcomePage', () => {
  let fixture: ComponentFixture<RekeyUploadOutcomePage>;
  let component: RekeyUploadOutcomePage;
  let store$: Store<StoreModel>;
  let deviceProvider: DeviceProvider;
  let router: Router;

  beforeEach(waitForAsync(() => {
    jasmine.getEnv().allowRespy(true);
    TestBed.configureTestingModule({
      declarations: [RekeyUploadOutcomePage],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({
          tests: testsReducer,
          rekeyReason: rekeyReasonReducer,
        }),
      ],
      providers: [
        {
          provide: Platform,
          useClass: PlatformMock,
        },
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: AuthenticationProvider,
          useClass: AuthenticationProviderMock,
        },
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(RekeyUploadOutcomePage);
    component = fixture.componentInstance;
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(store$, 'dispatch');
    spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions', async () => {
        spyOn(Insomnia, 'allowSleep');
        await component.ionViewDidEnter();
        expect(Insomnia.allowSleep).toHaveBeenCalled();
        expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
        expect(store$.dispatch).toHaveBeenCalledWith(RekeyUploadOutcomeViewDidEnter());
      });
    });

    describe('goToJournal', () => {
      it('should navigate to rekey search when fromRekeySearch is true', async () => {
        component.fromRekeySearch = true;
        await component.goToJournal();
        expect(router.navigate).toHaveBeenCalledWith([REKEY_SEARCH_PAGE]);
      });
      it('should navigate to journal when fromRekeySearch is false', async () => {
        component.fromRekeySearch = false;
        await component.goToJournal();
        expect(router.navigate).toHaveBeenCalledWith([JOURNAL_PAGE]);
      });
      it('should dispatch rekey action always', async () => {
        await component.goToJournal();
        expect(store$.dispatch).toHaveBeenCalledWith(EndRekey());
      });
    });
  });

  describe('ionViewWillEnter', () => {
    it('should subscribe to merged if it exists', () => {
      component.subscription = null;
      component.merged$ = of(true);
      spyOn(component.merged$, 'subscribe');
      component.ionViewWillEnter();
      expect(component.subscription).not.toEqual(null);
    });
  });

  describe('ionViewDidLeave', () => {
    it('should unsubscribe from the subscription if there is one', () => {
      component.subscription = new Subscription();
      spyOn(component.subscription, 'unsubscribe');
      component.ionViewDidLeave();
      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    describe('isDuplicate', () => {
      it('should show the success message when the upload succeeded', () => {
        fixture.detectChanges();
        component.pageState.duplicateUpload$ = of(false);
        fixture.detectChanges();
        const element: HTMLElement = fixture.debugElement.query(By.css('.modal-alert-header')).nativeElement;
        expect(element.textContent).toEqual('Rekeyed test uploaded successfully');
        expect(fixture.debugElement.query(By.css('.tick-icon'))).toBeDefined();
        expect(fixture.debugElement.query(By.css('.warning-icon'))).toBeNull();
      });
      it('should show the duplicate upload message when the upload was detected as a duplicate', () => {
        fixture.detectChanges();
        component.pageState.duplicateUpload$ = of(true);
        fixture.detectChanges();
        const element: HTMLElement = fixture.debugElement.query(By.css('.modal-alert-header')).nativeElement;
        expect(element.textContent).toEqual('Rekeyed test has already been uploaded');
        expect(fixture.debugElement.query(By.css('.warning-icon'))).toBeDefined();
        expect(fixture.debugElement.query(By.css('.tick-icon'))).toBeNull();
      });
    });
  });
});
