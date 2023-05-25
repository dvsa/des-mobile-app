import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { provideMockStore } from '@ngrx/store/testing';

import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestCentre } from '@dvsa/mes-journal-schema';
import { SlotProvider } from '@providers/slot/slot';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { SecureStorage } from '@awesome-cordova-plugins/secure-storage/ngx';
import { SecureStorageMock } from '@mocks/ionic-mocks/secure-storage.mock';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
import { NetworkStateProvider } from '@providers/network-state/network-state';
import { NetworkStateProviderMock } from '@providers/network-state/__mocks__/network-state.mock';
import {
  TranslateService,
} from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { TestCentreJournalComponentsModule } from '../../test-centre-journal-components.module';
import * as mockData from '../__mocks__/candidate-search-card.mock';
import { CandidateData, CandidateSearchCardComponent } from '../candidate-search-card';

describe('CandidateSearchCardComponent', () => {
  let component: CandidateSearchCardComponent;
  let fixture: ComponentFixture<CandidateSearchCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateSearchCardComponent],
      imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        TestCentreJournalComponentsModule,
      ],
      providers: [
        { provide: SlotProvider, useClass: SlotProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: AppInfoProvider, useClass: AppInfoProviderMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },

        provideMockStore({ initialState: {} }),
      ],
    });

    fixture = TestBed.createComponent(CandidateSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCandidateList', () => {
    it('should return the correct data', () => {
      const expectedCandidateList = [
        {
          name: 'Florence Pearson',
        },
      ] as CandidateData[];
      component.testCentreResults = mockData.mockExaminerData;
      const candidateList = component.getCandidateList();
      expect(candidateList).toEqual(expectedCandidateList);
    });
  });

  describe('createCandidateSlots', () => {
    it('should create an array of all the test slots for the selected candidate name', () => {
      component.createCandidateSlots(mockData.mockMultipleExaminerTestSlots, 'Joe Bloggs');
      expect(component.candidateTestSlots.length).toEqual(2);
    });
  });

  describe('onCandidateDidChange', () => {
    it('should enable the show results button if valid candidate selected', () => {
      spyOn(component, 'createCandidateSlots');
      const candidateName: string = 'Joe Bloggs';
      component.testCentreResults = {
        examiners: [],
      } as TestCentreDetailResponse;
      const candidate = {
        name: candidateName,
      } as CandidateData;
      component.onCandidateDidChange(candidate);
      expect(component.shouldShowCandidateResults).toEqual(false);
      expect(component.selectedCandidateName).toEqual(candidateName);
      expect(component.createCandidateSlots).toHaveBeenCalledWith([], candidateName);
      expect(component.enableShowBookingButton).toEqual(true);
    });
    it('should disable the show results button if invalid candidate entered', () => {
      component.onCandidateDidChange(null);
      expect(component.enableShowBookingButton).toEqual(false);
    });
  });

  describe('showResults', () => {
    it('should set the local property', () => {
      component.showResults();
      expect(component.shouldShowCandidateResults).toEqual(true);
    });
  });

  describe('get slashSeperatedTestCentres', () => {
    it('should replace the commas in the string with slashes', () => {
      component.testCentreName = 'TEST CENTRE A, TEST CENTRE B, TEST CENTRE C';
      expect(component.slashSeperatedTestCentres).toEqual('TEST CENTRE A / TEST CENTRE B / TEST CENTRE C');
    });
    it('should use default if not defined', () => {
      component.testCentreName = null;
      expect(component.slashSeperatedTestCentres).toEqual('test centre');
    });
  });
  describe('onTestCentreDidChange', () => {
    beforeEach(() => {
      spyOn(component, 'onManualRefresh');
      spyOn(component.testCentreChanged, 'emit');
    });
    it('should not call the refresh or emission when input not defined', () => {
      component.onTestCentreDidChange(null);
      expect(component.onManualRefresh).not.toHaveBeenCalled();
      expect(component.testCentreChanged.emit).not.toHaveBeenCalled();
    });
    it('should call the refresh & emission when input is defined', () => {
      component.onTestCentreDidChange({} as TestCentre);
      expect(component.onManualRefresh).toHaveBeenCalled();
      expect(component.testCentreChanged.emit).toHaveBeenCalledWith({} as TestCentre);
    });
  });
  describe('onManualRefresh', () => {
    it('should reset page flags', () => {
      component.onManualRefresh();
      expect(component.shouldShowCandidateResults).toEqual(false);
      expect(component.enableShowBookingButton).toEqual(false);
    });
  });

});
