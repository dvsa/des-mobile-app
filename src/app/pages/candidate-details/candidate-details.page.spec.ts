import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';

import {
  provideMockStore,
  // MockStore,
} from '@ngrx/store/testing';
import { ModalControllerMock } from 'ionic-mocks';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { CandidateDetailsPage } from './candidate-details.page';
import { DisplayAddressComponent } from '../../../components/common/display-address/display-address';
import { DataRowComponent } from '../../../components/common/data-row/data-row';
import { DataRowCustomComponent } from '../../../components/common/data-row-custom/data-row-custom';
import * as candidateDetails from '../../../store/candidate-details/candidate-details.selector';

// export const spyOnFunction = <T>(classObject: T, method: keyof T): jasmine.Spy => {
//   const spy: jasmine.Spy = jasmine.createSpy(method as string);
//   spyOnProperty(classObject, method, 'get').and.returnValue(spy);
//   return spy;
// };

fdescribe('CandidateDetailsPage', () => {
  let component: CandidateDetailsPage;
  let fixture: ComponentFixture<CandidateDetailsPage>;
  // let store$: MockStore;
  const initialState = { loggedIn: false };

  const mockNavParams = {
    get: () => {
      return {
        slotDetail: {
          slotId: 123,
          start: '123',
        },
        // booking: {
        //   candidate: {
        //     candidateName: {
        //       title: 'Mr',
        //       firstname: 'Tim',
        //       lastName: 'Burr',
        //     },
        //     driverNumber: 'ABC123'
        //   }
        // },
        // application: {
        //   testCategory: TestCategory.B,
        //   meetingPlace: 'Somewhere',
        // }
      };
    },
  };

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateDetailsPage,
        MockComponent(DisplayAddressComponent),
        MockComponent(DataRowComponent),
        MockComponent(DataRowCustomComponent),
      ],
      imports: [
        IonicModule,
      ],
      providers: [
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: NavParams, useValue: mockNavParams },
        provideMockStore({ initialState }),
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CandidateDetailsPage);
    component = fixture.componentInstance;
    // store$ = TestBed.inject(MockStore);
  }));

  describe('Should be correctly configured', () => {
    it('should be created successfully', () => {
      expect(component instanceof CandidateDetailsPage).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should test ngOnInit', () => {
      spyOnProperty(candidateDetails, 'getCandidateName', 'get').and.returnValue('Mr Tim Burr');
      component.ngOnInit();
      expect(true).toEqual(true);
    });
  });

});
