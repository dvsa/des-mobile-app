import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

import { Router } from '@angular/router';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DisplayAddressComponent } from '@components/common/display-address/display-address';
import { InappropriateUseBannerComponent } from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { Application, TestSlot } from '@dvsa/mes-journal-schema';
import { SearchResultTestSchema } from '@dvsa/mes-search-schema';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CandidateDetailNavigationComponent } from '@pages/candidate-details/components/candidate-detail-navigation/candidate-detail-navigation';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotItem } from '@providers/slot-selector/slot-item';
import { SlotProvider } from '@providers/slot/slot';
import { StoreModel } from '@shared/models/store.model';
import * as candidateDetailActions from '@store/candidate-details/candidate-details.actions';
import * as journalActions from '@store/journal/journal.actions';
import { JournalModel } from '@store/journal/journal.model';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { MockComponent } from 'ng-mocks';
import { CandidateDetailsPage } from '../candidate-details.page';

describe('CandidateDetailsPage', () => {
  let component: CandidateDetailsPage;
  let fixture: ComponentFixture<CandidateDetailsPage>;
  let store$: MockStore;

  const mockNavParams = {
    get: (param: string) => {
      const data = {
        slot: {
          slotDetail: {
            slotId: 123,
            start: '123',
          },
          booking: {
            candidate: {
              candidateName: {
                firstName: 'Tim',
                lastName: 'Burr',
                title: 'Mr',
              },
              driverNumber: 'ABC123',
            },
            application: {
              testCategory: TestCategory.B,
              meetingPlace: 'Somewhere',
            },
            business: {},
          },
        } as TestSlot,
        slotChanged: false,
      };
      return data[param];
    },
  };

  const initialState = {
    journal: {
      slots: {
        '2023-03-06': [],
        '2023-03-07': [],
      } as { [k: string]: SlotItem[] },
      selectedDate: '2023-03-06',
    } as JournalModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateDetailsPage,
        MockComponent(DisplayAddressComponent),
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(InappropriateUseBannerComponent),
        MockComponent(CandidateDetailNavigationComponent),
      ],
      imports: [IonicModule],
      providers: [
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useValue: mockNavParams },
        { provide: Router, useClass: RouterMock },
        { provide: SlotProvider, useClass: SlotProvider },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(CandidateDetailsPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(MockStore);
  }));

  describe('Should be correctly configured', () => {
    it('should be created successfully', () => {
      expect(component instanceof CandidateDetailsPage).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should test ngOnInit', () => {
      component.slot = {
        vehicleSlotTypeCode: 2,
        vehicleTypeCode: 'test',
        examinerVisiting: false,
        slotDetail: {
          slotId: 1,
          start: '2',
          duration: 3,
        },
        testCentre: {
          centreId: 1,
          centreName: '2',
          costCode: '3',
        },
        booking: {
          candidate: { candidateName: { firstName: 'test', lastName: 'test1' } },
          application: { testCategory: TestCategory.B } as Application,
          previousCancellation: null,
          business: null,
        },
      };
      component.slots = [{ vehicleSlotTypeCode: 1 }, { vehicleSlotTypeCode: 2 }, { vehicleSlotTypeCode: 3 }];
      spyOn(window, 'setTimeout').and.callThrough();
      component.ngOnInit();
      expect(setTimeout).toHaveBeenCalledTimes(2);
    });
  });

  describe('changeCandidate', () => {
    it('should set slot to prevSlot and ngOnInit to be called if switch case is "prev"', () => {
      component.prevSlot = { vehicleSlotTypeCode: 1 };
      component.nextSlot = { vehicleSlotTypeCode: 2 };
      component.slot = { vehicleSlotTypeCode: 3 };
      spyOn(component, 'ngOnInit');

      component.changeCandidate('prev');

      expect(component.ngOnInit).toHaveBeenCalled();
      expect(component.slot).toEqual({ vehicleSlotTypeCode: 1 });
    });
    it('should set slot to nextSlot and ngOnInit to be called if switch case is "next"', () => {
      component.prevSlot = { vehicleSlotTypeCode: 1 };
      component.nextSlot = { vehicleSlotTypeCode: 2 };
      component.slot = { vehicleSlotTypeCode: 3 };
      spyOn(component, 'ngOnInit');

      component.changeCandidate('next');

      expect(component.ngOnInit).toHaveBeenCalled();
      expect(component.slot).toEqual({ vehicleSlotTypeCode: 2 });
    });
    it('should not set slot or call ngOnInit if switch case is not "prev" or "next"', () => {
      component.prevSlot = { vehicleSlotTypeCode: 1 };
      component.nextSlot = { vehicleSlotTypeCode: 2 };
      component.slot = { vehicleSlotTypeCode: 3 };
      spyOn(component, 'ngOnInit');

      component.changeCandidate('test');

      expect(component.ngOnInit).not.toHaveBeenCalled();
      expect(component.slot).toEqual({ vehicleSlotTypeCode: 3 });
    });
  });

  describe('ionViewDidEnter', () => {
    it('should test ionViewDidEnter', () => {
      spyOn(store$, 'dispatch').and.stub();
      component.slot = {
        slotDetail: {
          slotId: 123,
          start: '123',
        },
      };
      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(
        candidateDetailActions.CandidateDetailsViewDidEnter({
          slot: {
            slotDetail: {
              slotId: 123,
              start: '123',
            },
          },
        })
      );
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.CandidateDetailsSeen({ slotId: 123 }));
    });
  });

  describe('isRecovered', () => {
    it('should return true when autosave remotely is true and test status is not autosaved', () => {
      const completedTests = [{ applicationReference: 112233, autosave: 1 }];
      const slot = { booking: { application: { applicationId: 11, bookingSequence: 22, checkDigit: 33 } } };
      const testStatus = TestStatus.Completed;
      expect(component.isRecovered(completedTests as SearchResultTestSchema[], slot, testStatus)).toEqual(true);
    });

    it('should return false when autosave remotely is false', () => {
      const completedTests = [{ applicationReference: 112233, autosave: 0 }];
      const slot = { booking: { application: { applicationId: 11, bookingSequence: 22, checkDigit: 33 } } };
      const testStatus = TestStatus.Completed;
      expect(component.isRecovered(completedTests as SearchResultTestSchema[], slot, testStatus)).toEqual(false);
    });

    it('should return false when test status is autosaved', () => {
      const completedTests = [{ applicationReference: 112233, autosave: 0 }];
      const slot = { booking: { application: { applicationId: 11, bookingSequence: 22, checkDigit: 33 } } };
      const testStatus = TestStatus.Autosaved;
      expect(component.isRecovered(completedTests as SearchResultTestSchema[], slot, testStatus)).toEqual(false);
    });
  });

  describe('specialNeedsIsPopulated', () => {
    it('returns true for a populated array', () => {
      const specialNeedsString: string[] = ['one', 'two', 'three', 'four'];
      const result = component.specialNeedsIsPopulated(specialNeedsString);
      expect(result).toEqual(true);
    });

    it("returns false for first index being 'None'", () => {
      const specialNeedsString: string[] = ['None'];
      const result = component.specialNeedsIsPopulated(specialNeedsString);
      expect(result).toEqual(false);
    });
  });

  describe('dismiss', () => {
    it('should dismiss open modal', fakeAsync(async () => {
      spyOn(store$, 'dispatch');
      spyOn(component.modalController, 'dismiss').and.returnValue(Promise.resolve(true));
      await component.dismiss();
      expect(component.modalController.dismiss).toHaveBeenCalled();
      expect(store$.dispatch).toHaveBeenCalledWith(
        candidateDetailActions.CandidateDetailsModalDismiss({ sourcePage: 'url' })
      );
    }));
  });

  describe('formatUrl', () => {
    it('should remove the first character from a string', () => {
      expect(component.formatUrl('/test')).toEqual('test');
    });

    it('should return null if url is an empty string', () => {
      expect(component.formatUrl('')).toEqual(null);
    });

    it('should return null if url is null', () => {
      expect(component.formatUrl(null)).toEqual(null);
    });
  });

  describe('isCompleted', () => {
    it('should return true if completedTestOutcome pupulated', () => {
      expect(component.isCompleted(TestStatus.Booked, '2')).toEqual(true);
    });

    it('should return true if testStatus is Completed or Submitted', () => {
      expect(component.isCompleted(TestStatus.Completed, null)).toEqual(true);
      expect(component.isCompleted(TestStatus.Submitted, null)).toEqual(true);
    });

    it('should return false if both completedTestOutcome and testStatus are false', () => {
      expect(component.isCompleted(TestStatus.Booked, null)).toEqual(false);
    });
  });
});
