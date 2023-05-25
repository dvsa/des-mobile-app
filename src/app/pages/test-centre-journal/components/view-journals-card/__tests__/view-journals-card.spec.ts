import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule, IonSelect } from '@ionic/angular';
import { ExaminerWorkSchedule, TestCentre } from '@dvsa/mes-journal-schema';
import { CommonModule } from '@angular/common';
import { ViewContainerRef } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';

import { SlotProvider } from '@providers/slot/slot';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { ExaminerSlotItemsByDate } from '@store/journal/journal.model';
import { StoreModel } from '@shared/models/store.model';
import { Store } from '@ngrx/store';
import { TestCentreJournalDateNavigation } from '@pages/test-centre-journal/test-centre-journal.actions';
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
import { TranslateService } from '@ngx-translate/core';
import { translateServiceMock } from '@shared/helpers/__mocks__/translate.mock';
import { AppInfoProvider } from '@providers/app-info/app-info';
import { AppInfoProviderMock } from '@providers/app-info/__mocks__/app-info.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { TestCentreJournalComponentsModule } from '../../test-centre-journal-components.module';
import { Day, ViewJournalsCardComponent } from '../view-journals-card';

describe('ViewJournalsCardComponent', () => {
  let fixture: ComponentFixture<ViewJournalsCardComponent>;
  let component: ViewJournalsCardComponent;
  let slotProvider: SlotProvider;
  let store$: Store<StoreModel>;
  const mockTestCentreDetailResponse = {
    examiners: [
      { staffNumber: '123', journal: { examiner: { individualId: 1 } } },
      { staffNumber: '456', journal: { examiner: { individualId: 2 } } },
      { staffNumber: '789', journal: { examiner: { individualId: 3 } } },
    ],
  } as TestCentreDetailResponse;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewJournalsCardComponent,
      ],
      imports: [
        TestCentreJournalComponentsModule,
        IonicModule,
        CommonModule,
      ],
      providers: [
        { provide: SlotProvider, useClass: SlotProviderMock },
        { provide: SlotSelectorProvider, useClass: SlotSelectorProviderMock },
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

    fixture = TestBed.createComponent(ViewJournalsCardComponent);
    component = fixture.componentInstance;
    slotProvider = TestBed.inject(SlotProvider);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('ngOnChanges', () => {
      beforeEach(() => {
        spyOn(component, 'onManualRefresh');
      });
      it('should not run onManualRefresh when manuallyRefreshed is false', () => {
        component.manuallyRefreshed = false;
        component.ngOnChanges();
        expect(component.onManualRefresh).not.toHaveBeenCalled();
      });
      it('should run onManualRefresh when manuallyRefreshed is true', () => {
        component.manuallyRefreshed = true;
        component.ngOnChanges();
        expect(component.onManualRefresh).toHaveBeenCalled();
      });
    });
    describe('onManualRefresh', () => {
      it('should reset page state', () => {
        component.slotContainer = {
          clear: () => {
          },
        } as ViewContainerRef;
        spyOn(component.slotContainer, 'clear');
        component.examinerSelect = {
          value: 'something',
        } as IonSelect;
        component.onManualRefresh();
        expect(component.journal).toEqual(null);
        expect(component.examinerName).toEqual(null);
        expect(component.hasSelectedExaminer).toEqual(false);
        expect(component.hasClickedShowJournal).toEqual(false);
        expect(component.examinerSelect.value).toEqual(null);
        expect(component.slotContainer.clear).toHaveBeenCalled();
      });
    });
    describe('interfaceOptions', () => {
      it('should return config for ion-select', () => {
        expect(component.interfaceOptions).toEqual({
          cssClass: 'mes-select',
          backdropDismiss: false,
          placeholder: 'Select examiner',
          okText: 'Select',
          cancelText: 'Cancel',
        });
      });
    });
    describe('examinerChanged', () => {
      beforeEach(() => {
        component.slotContainer = {
          clear: () => {
          },
        } as ViewContainerRef;
        component.testCentreResults = mockTestCentreDetailResponse;
        spyOn(component.slotContainer, 'clear');
      });
      it('should use the staffNumber to do a lookup and retrieve appropriate journal', () => {
        component.examinerChanged('456');
        expect(component.journal).toEqual({ examiner: { individualId: 2 } } as ExaminerWorkSchedule);
        expect(component.slotContainer.clear).toHaveBeenCalled();
      });
      it('should not call slotContainer.clear when undefined staff number passed in', () => {
        component.examinerChanged(null);
        expect(component.slotContainer.clear).not.toHaveBeenCalled();
      });
    });
    describe('onShowJournalClick', () => {
      beforeEach(() => {
        spyOn(slotProvider, 'detectSlotChanges').and.returnValue([]);
        spyOn(slotProvider, 'getRelevantSlotItemsByDate').and.returnValue({
          '2021-03-27': [],
        } as { [date: string]: SlotItem[] });
        component.currentSelectedDate = '2021-03-27';
        component.hasClickedShowJournal = false;
      });
      it('should set hasClickedShowJournal but not run slot creation when journal is null', () => {
        component.journal = null;
        component.onShowJournalClick();
        expect(component.hasClickedShowJournal).toEqual(true);
        expect(slotProvider.detectSlotChanges).not.toHaveBeenCalled();
      });
      it('should call detectSlotChanges and call getRelevantSlotItemsByDate and return nothing when there'
                + ' are no slot items', () => {
        component.journal = {
          examiner: {
            staffNumber: '123456',
          },
        } as ExaminerWorkSchedule;
        component.onShowJournalClick();
        component.slotItems$.subscribe(() => {
          expect(slotProvider.getRelevantSlotItemsByDate).toHaveBeenCalledWith([]);
          expect(component.hasClickedShowJournal).toEqual(true);
          expect(slotProvider.detectSlotChanges).toHaveBeenCalledWith({}, component.journal as ExaminerWorkSchedule);
        });
      });
    });
  });

  describe('canNavigateToNextDay', () => {
    it('should return true when nextDay is not empty', () => {
      component.currentSelectedDate = '2021-03-25';
      component.today = '2021-03-24';
      component.examinerSlotItemsByDate = {
        examiner: {},
        slotItemsByDate: {
          '2021-03-26': [{} as SlotItem],
        } as { [date: string]: SlotItem[] },
      } as ExaminerSlotItemsByDate;
      expect(component.canNavigateToNextDay()).toEqual(true);
    });
    it('should return true when isInRange', () => {
      component.currentSelectedDate = '2021-03-24';
      component.today = '2021-03-24';
      component.examinerSlotItemsByDate = {
        examiner: {},
        slotItemsByDate: {
          '2021-03-25': [],
        } as { [date: string]: SlotItem[] },
      } as ExaminerSlotItemsByDate;
      expect(component.canNavigateToNextDay()).toEqual(true);
    });
    it('should return false when nextDay is empty and not isInRange', () => {
      component.currentSelectedDate = '2021-03-25';
      component.examinerSlotItemsByDate = {
        examiner: {},
        slotItemsByDate: {
          '2021-03-24': [],
        } as { [date: string]: SlotItem[] },
      } as ExaminerSlotItemsByDate;
      expect(component.canNavigateToNextDay()).toEqual(false);
    });
  });
  describe('canNavigateToPreviousDay', () => {
    it('should return true when dayBefore is not empty', () => {
      component.currentSelectedDate = '2021-03-25';
      component.examinerSlotItemsByDate = {
        examiner: {},
        slotItemsByDate: {
          '2021-03-24': [{} as SlotItem],
        } as { [date: string]: SlotItem[] },
      } as ExaminerSlotItemsByDate;
      expect(component.canNavigateToPreviousDay()).toEqual(true);
    });
    it('should return false when dayBefore is empty', () => {
      component.currentSelectedDate = '2021-03-25';
      component.examinerSlotItemsByDate = {
        examiner: {},
        slotItemsByDate: {
          '2021-03-24': [],
        } as { [date: string]: SlotItem[] },
      } as ExaminerSlotItemsByDate;
      expect(component.canNavigateToPreviousDay()).toEqual(false);
    });
  });
  describe('isSelectedDateToday', () => {
    it('should return true when currentSelectedDate is same as today', () => {
      component.currentSelectedDate = '2021-03-25';
      component.today = '2021-03-25';
      expect(component.isSelectedDateToday()).toEqual(true);
    });
    it('should return false when currentSelectedDate is not same as today', () => {
      component.currentSelectedDate = '2021-03-25';
      component.today = '2021-03-24';
      expect(component.isSelectedDateToday()).toEqual(false);
    });
  });
  describe('onPreviousDayClick', () => {
    it('should set currentSelectedDate to be today and call onShowJournalClick', () => {
      spyOn(component, 'onShowJournalClick');
      component.today = '2021-03-24';
      component.onPreviousDayClick();
      expect(component.currentSelectedDate).toEqual('2021-03-24');
      expect(component.onShowJournalClick).toHaveBeenCalled();
    });
  });
  describe('shouldShowBanner', () => {
    it('should return true meaning slots are empty for currentSelectedDate', () => {
      component.examinerName = 'name';
      component.currentSelectedDate = '2021-03-25';
      component.examinerSlotItemsByDate = {
        examiner: {},
        slotItemsByDate: {
          '2021-03-25': [],
        } as { [date: string]: SlotItem[] },
      } as ExaminerSlotItemsByDate;
      expect(component.shouldShowBanner()).toEqual(true);
    });
    it('should return false meaning slots are not empty for currentSelectedDate', () => {
      component.examinerName = 'name';
      component.currentSelectedDate = '2021-03-25';
      component.examinerSlotItemsByDate = {
        examiner: {},
        slotItemsByDate: {
          '2021-03-25': [{} as SlotItem],
        } as { [date: string]: SlotItem[] },
      } as ExaminerSlotItemsByDate;
      expect(component.shouldShowBanner()).toEqual(false);
    });
  });
  describe('dayLabel', () => {
    it('should return today when is isSelectedDateToday', () => {
      spyOn(component, 'isSelectedDateToday').and.returnValue(true);
      expect(component.dayLabel).toEqual('today');
    });
    it('should return tomorrow when not isSelectedDateToday', () => {
      spyOn(component, 'isSelectedDateToday').and.returnValue(false);
      expect(component.dayLabel).toEqual('tomorrow');
    });
  });
  describe('warningText', () => {
    it('should generate a string indicating examiner has no slots at test centre on given day', () => {
      spyOnProperty(component, 'dayLabel', 'get').and.returnValue('today');
      component.testCentreName = 'Some centre';
      component.examinerName = 'Some name';
      expect(component.warningText).toEqual('Some name does not have any test bookings at Some centre today');
    });
  });
  describe('onNextDayClick', () => {
    it('should dispatch an action for navigation and call onShowJournalClick', () => {
      spyOn(component, 'onShowJournalClick');
      component.onNextDayClick();
      expect(store$.dispatch).toHaveBeenCalledWith(TestCentreJournalDateNavigation(Day.TOMORROW));
      expect(component.onShowJournalClick).toHaveBeenCalled();
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
});
