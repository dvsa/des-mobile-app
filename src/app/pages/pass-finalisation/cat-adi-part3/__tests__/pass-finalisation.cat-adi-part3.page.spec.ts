import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { TestResultCommonSchema } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { FurtherDevelopmentComponent } from '@pages/pass-finalisation/cat-adi-part3/components/further-development/further-development.component';
import {
  PassFinalisationValidationError,
  PassFinalisationViewDidEnter,
} from '@pages/pass-finalisation/pass-finalisation.actions';

import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { DateTime } from '@shared/helpers/date-time';
import { StoreModel } from '@shared/models/store.model';
import { EndTimeChanged } from '@store/tests/test-data/cat-adi-part3/end-time/end-time.actions';
import {
  ReasonForNoAdviceGivenChanged,
  SeekFurtherDevelopmentChanged,
} from '@store/tests/test-data/cat-adi-part3/review/review.actions';
import { StartTimeChanged } from '@store/tests/test-data/cat-adi-part3/start-time/start-time.actions';
import { TestsModel } from '@store/tests/tests.model';
import { MockComponent } from 'ng-mocks';
import { Subscription } from 'rxjs';
import { PassFinalisationCatADIPart3Page } from '../pass-finalisation.cat-adi-part3.page';

describe('PassFinalisationCatADIPart3Page', () => {
  let component: PassFinalisationCatADIPart3Page;
  let fixture: ComponentFixture<PassFinalisationCatADIPart3Page>;
  let store$: Store<StoreModel>;

  const initialState = {
    appInfo: { employeeId: '123456' },
    tests: {
      currentTest: {
        slotId: '123',
      },
      testStatus: {},
      startedTests: {
        123: {
          version: '1',
          rekey: false,
          activityCode: '1',
          passCompletion: {
            passCertificateNumber: 'test',
            code78Present: true,
          },
          category: TestCategory.SC,
          communicationPreferences: { conductedLanguage: 'English' },
          changeMarker: null,
          examinerBooked: null,
          examinerConducted: null,
          examinerKeyed: null,
          journalData: {
            examiner: null,
            testCentre: null,
            testSlotAttributes: null,
            applicationReference: null,
            candidate: {
              candidateName: {
                firstName: 'Firstname',
                lastName: 'Lastname',
              },
            },
          },
          testData: {
            startTime: '1111-01-01T01:01:01',
            endTime: '4444-04-04T04:44:44',
            review: {
              seekFurtherDevelopment: true,
            },
            vehicleChecks: {
              fullLicenceHeld: false,
              showMeQuestions: null,
              tellMeQuestions: null,
            },
            safetyQuestions: {
              questions: [
                {
                  outcome: 'DF',
                  description: 'Fire Extinguisher',
                },
                {
                  outcome: 'DF',
                  description: 'Emergency exit',
                },
                {
                  outcome: 'P',
                  description: 'Fuel cutoff',
                },
              ],
              faultComments: '',
            },
          },
        } as TestResultCommonSchema,
      },
    } as TestsModel,
  } as StoreModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterModule.forRoot([]),

        PassFinalisationCatADIPart3Page,
        MockComponent(PracticeModeOptionsBar),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(FurtherDevelopmentComponent),
      ],
      providers: [
        provideBasePageMocks(),
        { provide: Store },
        OutcomeBehaviourMapProvider,
        provideMockStore({ initialState }),
      ],
    });

    fixture = TestBed.createComponent(PassFinalisationCatADIPart3Page);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('class', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('furtherDevelopmentChanged', () => {
      it('should dispatch SeekFurtherDevelopmentChanged using the parameter given', () => {
        component.furtherDevelopmentChanged(true);
        expect(store$.dispatch).toHaveBeenCalledWith(SeekFurtherDevelopmentChanged(true));
      });
    });

    describe('ngOnInit', () => {
      it('should resolve state variables', () => {
        component.ngOnInit();
        component.pageState.isStandardsCheck$.subscribe((res) => expect(res).toEqual(true));
        component.pageState.testStartTime$.subscribe((res) => expect(res).toEqual('1111-01-01T01:01:01'));
        component.pageState.testEndTime$.subscribe((res) => expect(res).toEqual('4444-04-04T04:44:44'));
      });

      it('should default standards check end time to now plus 45 minutes when none exists', () => {
        const testResult = (initialState.tests.startedTests as any)[123];
        const originalEndTime = testResult.testData.endTime;
        testResult.testData.endTime = '';

        vi.spyOn(DateTime.prototype, 'add').mockImplementation(function (amount, unit) {
          return this;
        });
        vi.spyOn(DateTime.prototype, 'toISOString').mockReturnValue('mock-end-time');

        component.ngOnInit();

        component.pageState.testEndTime$.subscribe((res) => expect(res).toEqual('mock-end-time'));
        expect(DateTime.prototype.add).toHaveBeenCalledWith(45, 'minute');

        testResult.testData.endTime = originalEndTime;
      });
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        vi.spyOn(component.subscription, 'unsubscribe').mockReturnValue(undefined);
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });

    describe('testStartTimeChanged', () => {
      it('should dispatch endTime to store', () => {
        vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.testStartTimeChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(StartTimeChanged('test'));
      });
    });

    describe('testEndTimeChanged', () => {
      it('should dispatch endTime to store', () => {
        vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.testEndTimeChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(EndTimeChanged('test'));
      });
    });

    describe('ionViewWillEnter', () => {
      it('should dispatch PassFinalisationViewDidEnter', () => {
        vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
        component.ionViewWillEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationViewDidEnter());
      });
    });

    describe('adviceReasonChanged', () => {
      it('should dispatch ReasonForNoAdviceGivenChanged using the parameter given ', () => {
        component.adviceReasonChanged('test');
        expect(store$.dispatch).toHaveBeenCalledWith(ReasonForNoAdviceGivenChanged('test'));
      });
    });

    describe('onSubmit', () => {
      it('should call adviceReasonChanged with null if form is valid and furtherDevelopment is true', () => {
        component.form.clearValidators();
        component.furtherDevelopment = true;
        vi.spyOn(component, 'adviceReasonChanged').mockReturnValue(undefined);
        component.onSubmit();

        expect(component.adviceReasonChanged).toHaveBeenCalledWith(null);
      });
      it('should dispatch PassFinalisationValidationError if the controls are invalid', () => {
        component.form = new UntypedFormGroup({});
        for (let i = 0; i < 3; i += 1) {
          component.form.addControl(`test${i}`, new UntypedFormControl());
          component.form.controls[`test${i}`].setValidators([Validators.required]);
          component.form.controls[`test${i}`].setValue(null);
        }
        component.onSubmit();

        Object.keys(component.form.controls).forEach((controlName) => {
          expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationValidationError(`${controlName} is blank`));
        });
      });
    });
  });
});
