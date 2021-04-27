import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule, IonSelect } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';
import { CommonModule } from '@angular/common';
import { ViewContainerRef } from '@angular/core';

import { SlotProvider } from '@providers/slot/slot';
import { SlotSelectorProvider } from '@providers/slot-selector/slot-selector';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotProviderMock } from '@providers/slot/__mocks__/slot.mock';
import { SlotSelectorProviderMock } from '@providers/slot-selector/__mocks__/slot-selector.mock';
import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { ExaminerSlotItemsByDate } from '@store/journal/journal.model';
import { ViewJournalsCardComponent } from '../view-journals-card';
import { TestCentreJournalComponentsModule } from '../../test-centre-journal-components.module';
import { TestCentreJournalModule } from '../../../test-centre-journal.module';

describe('ViewJournalsCardComponent', () => {
  let fixture: ComponentFixture<ViewJournalsCardComponent>;
  let component: ViewJournalsCardComponent;
  let slotProvider: SlotProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewJournalsCardComponent,
      ],
      imports: [
        TestCentreJournalComponentsModule,
        TestCentreJournalModule,
        IonicModule,
        CommonModule,
      ],
      providers: [
        { provide: SlotProvider, useClass: SlotProviderMock },
        { provide: SlotSelectorProvider, useClass: SlotSelectorProviderMock },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewJournalsCardComponent);
    component = fixture.componentInstance;

    slotProvider = TestBed.inject(SlotProvider);
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
        component.slotContainer = { clear: () => {} } as ViewContainerRef;
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
          enableBackdropDismiss: false,
          placeholder: 'Select examiner',
          okText: 'Select',
          cancelText: 'Cancel',
        });
      });
    });
    describe('examinerChanged', () => {
      it('should use the staffNumber to do a lookup and retrieve appropriate journal', () => {
        component.testCentreResults = {
          examiners: [
            { staffNumber: '123', journal: { examiner: { individualId: 1 } } },
            { staffNumber: '456', journal: { examiner: { individualId: 2 } } },
            { staffNumber: '789', journal: { examiner: { individualId: 3 } } },
          ],
        } as TestCentreDetailResponse;
        component.examinerChanged('456');
        expect(component.journal).toEqual({ examiner: { individualId: 2 } } as ExaminerWorkSchedule);
      });
    });
    describe('onShowJournalClick', () => {
      beforeEach(() => {
        spyOn(slotProvider, 'detectSlotChanges').and.returnValue([]);
        spyOn(slotProvider, 'getRelevantSlotItemsByDate').and.returnValue({
          '2021-03-27': [],
        } as { [date: string]: SlotItem[] });
        spyOn<any>(component, 'createSlots');
        component.currentSelectedDate = '2021-03-27';
        component.hasClickedShowJournal = false;
      });
      it('should set hasClickedShowJournal but not run slot creation when journal is null', () => {
        component.journal = null;
        component.onShowJournalClick();
        expect(component.hasClickedShowJournal).toEqual(true);
        expect(slotProvider.detectSlotChanges).not.toHaveBeenCalled();
      });
      it('should ', () => {
        component.journal = {
          examiner: {
            staffNumber: '123456',
          },
        } as ExaminerWorkSchedule;
        component.onShowJournalClick();
        expect(component.hasClickedShowJournal).toEqual(true);
        expect(slotProvider.detectSlotChanges).toHaveBeenCalledWith({}, component.journal as ExaminerWorkSchedule);
        expect(slotProvider.getRelevantSlotItemsByDate).toHaveBeenCalledWith([]);
        expect(component['createSlots']).toHaveBeenCalledWith([]);
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
  });
});
