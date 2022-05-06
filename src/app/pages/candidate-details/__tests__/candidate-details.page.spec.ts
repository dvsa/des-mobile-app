import {
  ComponentFixture, fakeAsync, TestBed, waitForAsync,
} from '@angular/core/testing';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

import {
  provideMockStore,
  MockStore,
} from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { DisplayAddressComponent } from '@components/common/display-address/display-address';
import { DataRowComponent } from '@components/common/data-row/data-row';
import { DataRowCustomComponent } from '@components/common/data-row-custom/data-row-custom';
import * as journalActions from '@store/journal/journal.actions';
import * as candidateDetailActions from '@store/candidate-details/candidate-details.actions';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import {
  InappropriateUseBannerComponent,
} from '@components/common/inappropriate-use-banner/inappropriate-use-banner';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { CandidateDetailsPage } from '../candidate-details.page';

describe('CandidateDetailsPage', () => {
  let component: CandidateDetailsPage;
  let fixture: ComponentFixture<CandidateDetailsPage>;
  let store$: MockStore;
  const initialState = {};

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

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateDetailsPage,
        MockComponent(DisplayAddressComponent),
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
        MockComponent(InappropriateUseBannerComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useValue: mockNavParams },
        { provide: Router, useClass: RouterMock },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(waitForAsync(() => {
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
      spyOn(window, 'setTimeout').and.callThrough();
      component.ngOnInit();
      expect(setTimeout).toHaveBeenCalledTimes(2);
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
      expect(store$.dispatch).toHaveBeenCalledWith(candidateDetailActions.CandidateDetailsViewDidEnter({
        slot: {
          slotDetail: {
            slotId: 123,
            start: '123',
          },
        },
      }));
      expect(store$.dispatch).toHaveBeenCalledWith(journalActions.CandidateDetailsSeen({ slotId: 123 }));
    });
  });

  describe('specialNeedsIsPopulated', () => {
    it('returns true for a populated array', () => {
      const specialNeedsString: string[] = ['one', 'two', 'three', 'four'];
      const result = component.specialNeedsIsPopulated(specialNeedsString);
      expect(result).toEqual(true);
    });

    it('returns false for string', () => {
      const specialNeedsString: string = 'No details supplied';
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
      expect(store$.dispatch).toHaveBeenCalledWith(candidateDetailActions.CandidateDetailsModalDismiss(
        { sourcePage: 'url' },
      ));
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

});
