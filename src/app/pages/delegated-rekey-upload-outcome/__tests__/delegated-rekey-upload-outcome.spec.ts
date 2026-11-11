import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KeepAwake as Insomnia } from '@capacitor-community/keep-awake';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store, StoreModule } from '@ngrx/store';

import { delegatedSearchReducer } from '@pages/delegated-rekey-search/delegated-rekey-search.reducer';
import { DASHBOARD_PAGE, DELEGATED_REKEY_SEARCH_PAGE } from '@pages/page-names.constants';

import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';

import { DeviceProvider } from '@providers/device/device';
import { BasePageComponent } from '@shared/classes/base-page';
import { StoreModel } from '@shared/models/store.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { SendCurrentTest } from '@store/tests/tests.actions';
import { testsReducer } from '@store/tests/tests.reducer';
import { DelegatedRekeyUploadOutcomePage } from '../delegated-rekey-upload-outcome';

describe('DelegatedRekeyUploadOutcomePage', () => {
  let fixture: ComponentFixture<DelegatedRekeyUploadOutcomePage>;
  let component: DelegatedRekeyUploadOutcomePage;
  let router: Router;
  let store$: Store<StoreModel>;
  let deviceProvider: DeviceProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: testsReducer,
          delegatedRekeySearch: delegatedSearchReducer,
        }),
        DelegatedRekeyUploadOutcomePage,
      ],
      providers: [
        provideBasePageMocks(),
        {
          provide: DateTimeProvider,
          useClass: DateTimeProviderMock,
        },
      ],
    });

    fixture = TestBed.createComponent(DelegatedRekeyUploadOutcomePage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    deviceProvider = TestBed.inject(DeviceProvider);
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    vi.spyOn(router, 'navigate');
    vi.spyOn(BasePageComponent.prototype, 'isIos').mockReturnValue(true);
  });

  describe('Class', () => {
    describe('ionViewDidEnter', () => {
      it('should disable test inhibitions', async () => {
        vi.spyOn(Insomnia, 'allowSleep').mockReturnValue(undefined);
        await component.ionViewDidEnter();
        expect(Insomnia.allowSleep).toHaveBeenCalled();
        expect(deviceProvider.disableSingleAppMode).toHaveBeenCalled();
      });
    });
    describe('goToDashboard', () => {
      it('should call router navigate with DASHBOARD_PAGE', async () => {
        await component.goToDashboard();
        expect(router.navigate).toHaveBeenCalledWith([DASHBOARD_PAGE], { replaceUrl: true });
      });
    });
    describe('goToDelegatedSearch', () => {
      it('should call router navigate with DELEGATED_REKEY_SEARCH_PAGE', async () => {
        await component.goToDelegatedSearch();
        expect(router.navigate).toHaveBeenCalledWith([DELEGATED_REKEY_SEARCH_PAGE]);
      });
    });
    describe('isStatusSubmitted', () => {
      it('should return false when a value other then Submitted is passed in', () => {
        const submitted = component.isStatusSubmitted(TestStatus.Booked);
        expect(submitted).toEqual(false);
      });
      it('should return true when a value of Submitted is passed in', () => {
        const submitted = component.isStatusSubmitted(TestStatus.Submitted);
        expect(submitted).toEqual(true);
      });
    });
    describe('retryUpload', () => {
      it('should dispatch SendCurrentTest', () => {
        component.retryUpload();
        expect(store$.dispatch).toHaveBeenCalledWith(SendCurrentTest());
      });
    });
  });
});
