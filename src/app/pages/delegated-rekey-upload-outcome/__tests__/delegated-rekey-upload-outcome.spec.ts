import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock, RouterMock } from '@mocks/index.mock';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { StoreModel } from '@shared/models/store.model';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { testsReducer } from '@store/tests/tests.reducer';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { BasePageComponent } from '@shared/classes/base-page';
import { DASHBOARD_PAGE, DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { SendCurrentTest } from '@store/tests/tests.actions';
import { DelegatedRekeyUploadOutcomePage } from '../delegated-rekey-upload-outcome';

describe('DelegatedRekeyUploadOutcomePage', () => {
  let fixture: ComponentFixture<DelegatedRekeyUploadOutcomePage>;
  let component: DelegatedRekeyUploadOutcomePage;
  let router: Router;
  let store$: Store<StoreModel>;
  let insomnia: Insomnia;
  let deviceProvider: DeviceProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DelegatedRekeyUploadOutcomePage],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({
          tests: testsReducer,
        }),
      ],
      providers: [
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
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
          provide: Insomnia,
          useClass: InsomniaMock,
        },
        {
          provide: DeviceProvider,
          useClass: DeviceProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(DelegatedRekeyUploadOutcomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    insomnia = TestBed.inject(Insomnia);
    spyOn(store$, 'dispatch');
    spyOn(router, 'navigate');
    spyOn(BasePageComponent.prototype, 'isIos')
      .and
      .returnValue(true);
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions', async () => {
        await component.ionViewDidEnter();
        expect(insomnia.allowSleepAgain)
          .toHaveBeenCalled();
        expect(deviceProvider.disableSingleAppMode)
          .toHaveBeenCalled();
      });
    });
    describe('goToDashboard', () => {
      it('should call router navigate with DASHBOARD_PAGE', async () => {
        await component.goToDashboard();
        expect(router.navigate)
          .toHaveBeenCalledWith([DASHBOARD_PAGE], { replaceUrl: true });
      });
    });
    describe('goToDelegatedSearch', () => {
      it('should call router navigate with DELEGATED_REKEY_SEARCH_PAGE', async () => {
        await component.goToDelegatedSearch();
        expect(router.navigate)
          .toHaveBeenCalledWith([DELEGATED_REKEY_SEARCH_PAGE]);
      });
    });
    describe('isStatusSubmitted', () => {
      it('should return false when a value other then Submitted is passed in', () => {
        const submitted = component.isStatusSubmitted('Booked');
        expect(submitted)
          .toEqual(false);
      });
      it('should return true when a value of Submitted is passed in', () => {
        const submitted = component.isStatusSubmitted('Submitted');
        expect(submitted)
          .toEqual(true);
      });
    });
    describe('retryUpload', () => {
      it('should dispatch SendCurrentTest', () => {
        component.retryUpload();
        expect(store$.dispatch)
          .toHaveBeenCalledWith(SendCurrentTest());
      });
    });
  });

  describe('DOM', () => {
    describe('isDuplicate', () => {
      it('should show the success message when the upload succeeded', () => {
        fixture.detectChanges();
        component.pageState.testStatus$ = of(TestStatus.Submitted);
        fixture.detectChanges();
        const element: HTMLElement = fixture.debugElement.query(By.css('.modal-alert-header')).nativeElement;
        expect(element.textContent)
          .toEqual('Rekey upload was successful');
        expect(fixture.debugElement.query(By.css('.tick-icon')))
          .toBeDefined();
        expect(fixture.debugElement.query(By.css('.warning-icon')))
          .toBeNull();
      });
      it('should show the duplicate upload message when the upload was detected as a duplicate', () => {
        fixture.detectChanges();
        component.pageState.testStatus$ = of(TestStatus.Booked);
        fixture.detectChanges();
        const element: HTMLElement = fixture.debugElement.query(By.css('.modal-alert-header')).nativeElement;
        expect(element.textContent)
          .toEqual('Rekey upload was unsuccessful');
        expect(fixture.debugElement.query(By.css('.warning-icon')))
          .toBeDefined();
        expect(fixture.debugElement.query(By.css('.tick-icon')))
          .toBeNull();
      });
    });
  });
});
