import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from '@ionic/angular';
import { PlatformMock } from '@mocks/index.mock';
import { StoreModule, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Router } from '@angular/router';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { StoreModel } from '@shared/models/store.model';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
import { testsReducer } from '@store/tests/tests.reducer';
import { RekeyUploadOutcomePage } from '@pages/rekey-upload-outcome/rekey-upload-outcome.page';
import { JOURNAL_PAGE, REKEY_SEARCH_PAGE } from '@pages/page-names.constants';
import { EndRekey } from '@store/tests/rekey/rekey.actions';
import { BasePageComponent } from '@shared/classes/base-page';
import { RekeyUploadOutcomeViewDidEnter } from '@pages/rekey-upload-outcome/rekey-upload-outcome.actions';
import { rekeyReasonReducer } from '../../rekey-reason/rekey-reason.reducer';

describe('RekeyUploadOutcomePage', () => {
  let fixture: ComponentFixture<RekeyUploadOutcomePage>;
  let component: RekeyUploadOutcomePage;
  let store$: Store<StoreModel>;
  let screenOrientation: ScreenOrientation;
  let insomnia: Insomnia;
  let deviceProvider: DeviceProvider;
  let router: Router;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(waitForAsync(() => {
    jasmine.getEnv().allowRespy(true);
    TestBed.configureTestingModule({
      declarations: [
        RekeyUploadOutcomePage,
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({
          tests: testsReducer,
          rekeyReason: rekeyReasonReducer,
        }),
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
      ],
    });

    fixture = TestBed.createComponent(RekeyUploadOutcomePage);
    component = fixture.componentInstance;
    screenOrientation = TestBed.inject(ScreenOrientation);
    insomnia = TestBed.inject(Insomnia);
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    spyOn(store$, 'dispatch');
    spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
  }));

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions', () => {
        component.ionViewDidEnter();
        expect(screenOrientation.unlock).toHaveBeenCalled();
        expect(insomnia.allowSleepAgain).toHaveBeenCalled();
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
        expect(router.navigate).toHaveBeenCalledWith([JOURNAL_PAGE], { replaceUrl: true });
      });
      it('should dispatch rekey action always', async () => {
        await component.goToJournal();
        expect(store$.dispatch).toHaveBeenCalledWith(EndRekey());
      });
    });
  });

  describe('DOM', () => {
    describe('isDuplicate', () => {
      it('should show the sucess message when the upload succeeded', () => {
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
