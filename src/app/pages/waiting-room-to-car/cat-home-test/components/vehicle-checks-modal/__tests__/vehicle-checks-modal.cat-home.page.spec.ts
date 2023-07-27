import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { QuestionProvider } from '@providers/question/question';
import { QuestionProviderMock } from '@providers/question/__mocks__/question.mock';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { FormsModule, ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  VehicleChecksCatHomeTestModal,
} from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import { Subscription } from 'rxjs';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { IonicModule, NavParams } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import {
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-home/vehicle-checks/vehicle-checks.cat-home.actions';
import { take } from 'rxjs/operators';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { TestsModel } from '@store/tests/tests.model';
import { StoreModel } from '@shared/models/store.model';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

describe('VehicleChecksCatHomeTestModal', () => {
  let component: VehicleChecksCatHomeTestModal;
  let fixture: ComponentFixture<VehicleChecksCatHomeTestModal>;

  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          journalData: {
            candidate: {
              candidateName: {
                firstName: 'Firstname',
                lastName: 'Lastname',
              },
            },
          },
          testData: {
            vehicleChecks: {
              showMeQuestions: [
                {
                  code: 'Q1',
                  outcome: 'DF',
                  description: 'All doors secure',
                },
              ],
              tellMeQuestions: [
                {
                  code: 'Q3',
                  outcome: 'P',
                  description: 'Safety factors while loading',
                },
              ],
            },
          },
        } as CatFUniqueTypes.TestResult,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        VehicleChecksCatHomeTestModal,
      ],
      imports: [
        ComponentsModule,
        WaitingRoomToCarComponentsModule,
        IonicModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        StoreModule,
      ],
      providers: [
        NavParams,
        {
          provide: RouteByCategoryProvider,
          useClass: RouteByCategoryProviderMock,
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
          provide: QuestionProvider,
          useClass: QuestionProviderMock,
        },
        {
          provide: FaultCountProvider,
          useClass: FaultCountProvider,
        },
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksCatHomeTestModal);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.category = TestCategory.F;
  }));

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('Class',
    () => {
      describe('onClose', () => {
        it('should dismiss the modal when the function is run', () => {
          spyOn(component.modalCtrl, 'dismiss');
          component.onClose();
          expect(component.modalCtrl.dismiss)
            .toHaveBeenCalled();
        });
      });

      describe('ngOnInit', () => {
        afterEach(() => {
          // clean up subs
          component.subscription.unsubscribe();
        });
        it('should merge the correct data into the subscription', () => {
          component.ngOnInit();
          expect(component.subscription)
            .toBeDefined();
        });
        it('should resolve state variables', () => {
          component.ngOnInit();
          component.pageState.candidateName$
            .pipe(take(1))
            .subscribe((res) => expect(res)
              .toEqual('Firstname Lastname'));
          component.pageState.showMeQuestions$
            .pipe(take(1))
            .subscribe((res) => expect(res)
              .toEqual([
                {
                  code: 'Q1',
                  outcome: 'DF',
                  description: 'All doors secure',
                },
              ]));
          component.pageState.tellMeQuestions$
            .pipe(take(1))
            .subscribe((res) => expect(res)
              .toEqual([
                {
                  code: 'Q3',
                  outcome: 'P',
                  description: 'Safety factors while loading',
                },
              ]));
          component.pageState.vehicleChecksScore$
            .pipe(take(1))
            .subscribe((res) => expect(res)
              .toEqual({
                seriousFaults: 0,
                drivingFaults: 1,
              }));
        });

      });

      describe('onSubmit', () => {
        it('should dismiss the modal when the function is run', () => {
          spyOn(component.modalCtrl, 'dismiss');
          component.onSubmit();
          expect(component.modalCtrl.dismiss)
            .toHaveBeenCalled();
        });
      });
      describe('showMeQuestionChanged', () => {
        it('should ', () => {
          spyOn(component.store$, 'dispatch');
          component.showMeQuestionChanged(null, 0);
          expect(component.store$.dispatch)
            .toHaveBeenCalledWith(ShowMeQuestionSelected(null, 0));
        });
      });
      describe('showMeQuestionOutcomeChanged', () => {
        it('should dispatch', () => {
          spyOn(component.store$, 'dispatch');
          component.showMeQuestionOutcomeChanged(null, 0);
          expect(component.store$.dispatch)
            .toHaveBeenCalledWith(ShowMeQuestionOutcomeChanged(null, 0));
        });
      });
      describe('ionViewDidEnter', () => {
        it('should dispatch', () => {
          spyOn(component.store$, 'dispatch');
          component.ionViewDidEnter();
          expect(component.store$.dispatch)
            .toHaveBeenCalled();
        });
      });
      describe('tellMeQuestionChanged', () => {
        it('should dispatch', () => {
          spyOn(component.store$, 'dispatch');
          component.tellMeQuestionChanged(null, 0);
          expect(component.store$.dispatch)
            .toHaveBeenCalledWith(TellMeQuestionSelected(null, 0));
        });
      });
      describe('tellMeQuestionOutcomeChanged', () => {
        it('should dispatch', () => {
          spyOn(component.store$, 'dispatch');
          component.tellMeQuestionOutcomeChanged(null, 0);
          expect(component.store$.dispatch)
            .toHaveBeenCalledWith(TellMeQuestionOutcomeChanged(null, 0));
        });
      });
      describe('ionViewDidLeave', () => {
        it('should unsubscribe from the subscription if there is one', () => {
          component.subscription = new Subscription();
          spyOn(component.subscription, 'unsubscribe');
          component.ionViewDidLeave();
          expect(component.subscription.unsubscribe)
            .toHaveBeenCalled();
        });
      });
    });
});
