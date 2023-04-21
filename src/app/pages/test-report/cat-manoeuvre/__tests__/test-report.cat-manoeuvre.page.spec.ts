import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, NavParams, Platform, ToastController } from '@ionic/angular';
import { ModalControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { UncoupleRecoupleComponent } from '@pages/test-report/components/uncouple-recouple/uncouple-recouple';
import {
  ReverseManoeuvreComponent,
} from '@pages/test-report/cat-manoeuvre/components/reverse-manoeuvre/reverse-manoeuvre';
import { ToolbarComponent } from '@pages/test-report/components/toolbar/toolbar';
import { ToastControllerMock } from '@mocks/ionic-mocks/toast-controller.mock';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { StoreModel } from '@shared/models/store.model';
import { RecordManoeuvresSelection } from '@store/tests/test-data/common/manoeuvres/manoeuvres.actions';
import { EtaComponent } from '@pages/test-report/components/examiner-takes-action/eta';
import { Observable, Subscription } from 'rxjs';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { testReportReducer } from '../../test-report.reducer';
import { TestReportCatManoeuvrePage } from '../test-report.cat-manoeuvre.page';

describe('TestReportCatManoeuvrePage', () => {
  let fixture: ComponentFixture<TestReportCatManoeuvrePage>;
  let component: TestReportCatManoeuvrePage;
  let toastController: ToastController;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TestReportCatManoeuvrePage,
        MockComponent(ToolbarComponent),
        MockComponent(UncoupleRecoupleComponent),
        MockComponent(ReverseManoeuvreComponent),
        MockComponent(EtaComponent),
      ],
      imports: [
        AppModule,
        StoreModule.forFeature('testReport', testReportReducer),
        StoreModule.forFeature('tests', () => (
          {
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                testData: initialState,
                journalData: {
                  candidate: candidateMock,
                },
              },
            },
          })),
      ],
      providers: [
        {
          provide: NavParams,
          useClass: NavParamsMock,
        },
        {
          provide: Platform,
          useClass: PlatformMock,
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
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: TestReportValidatorProvider,
          useClass: TestReportValidatorProviderMock,
        },
        {
          provide: Insomnia,
          useClass: InsomniaMock,
        },
        {
          provide: ToastController,
          useClass: ToastControllerMock,
        },
      ],
    });

    fixture = TestBed.createComponent(TestReportCatManoeuvrePage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  });

  it('should create', () => {
    expect(component)
      .toBeTruthy();
  });

  describe('manoeuvreHasFaults', () => {
    it('should return true if either of control/observation is defined', () => {
      expect(component.manoeuvreHasFaults({
        controlFault: 'D',
        observationFault: null,
      }))
        .toEqual(true);
    });
    it('should return false if both of control/observation are not set', () => {
      expect(component.manoeuvreHasFaults({
        controlFault: null,
        observationFault: null,
      }))
        .toEqual(false);
    });
  });
  describe('toggleReverseManoeuvre', () => {
    it('should not dispatch select action when faults exist', () => {
      component.manoeuvresHasFaults = true;
      component.toggleReverseManoeuvre();
      expect(store$.dispatch)
        .not
        .toHaveBeenCalled();
    });
    it('should dispatch select action when no faults exist', () => {
      component.manoeuvresHasFaults = false;
      component.toggleReverseManoeuvre();
      expect(store$.dispatch)
        .toHaveBeenCalledWith(RecordManoeuvresSelection(ManoeuvreTypes.reverseManoeuvre));
    });
  });
  describe('getId', () => {
    it('should create an id based on manoeuvre and competency', () => {
      expect(component.getId(ManoeuvreTypes.reverseManoeuvre, ManoeuvreCompetencies.controlFault))
        .toEqual('reverseManoeuvre-controlFault');
    });
  });
  describe('competencyClick', () => {
    beforeEach(() => {
      spyOn(toastController, 'create')
        .and
        .returnValue(Promise.resolve({
          present: () => Promise.resolve(),
        } as HTMLIonToastElement));
    });
    it('should not call toast create if toast already exists', async () => {
      spyOn(toastController, 'getTop')
        .and
        .returnValue(Promise.resolve({} as HTMLIonToastElement));
      await component.competencyClick();
      expect(toastController.create)
        .not
        .toHaveBeenCalled();
    });
    it('should create toast controller if none already exist', async () => {
      spyOn(toastController, 'getTop')
        .and
        .returnValue(Promise.resolve(null));
      await component.competencyClick();
      expect(toastController.create)
        .toHaveBeenCalled();
    });
  });
  describe('End Test Button', () => {
    it('should call the end test function', () => {
      spyOn(component, 'onEndTestClick');
      const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
      endTestButton.triggerEventHandler('click', null);
      expect(component.onEndTestClick)
        .toHaveBeenCalled();
    });
  });
  describe('ionViewWillEnter', () => {
    it('should setup manoeuvreSubscription if merged is present', async () => {
      component.merged$ = new Observable<boolean>();
      await component.ionViewWillEnter();

      expect(component.manoeuvreSubscription).toBeDefined();
    });
    it('should call base page ionViewWillEnter', async () => {
      spyOn(TestReportBasePageComponent.prototype, 'ionViewWillEnter');
      await component.ionViewWillEnter();

      expect(TestReportBasePageComponent.prototype.ionViewWillEnter).toHaveBeenCalled();
    });
  });
  describe('ionViewDidLeave', () => {
    it('should call basePage functions and unsubscribe from subscription if there is one', () => {
      component.manoeuvreSubscription = new Subscription();
      spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave');
      spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription');
      spyOn(component.manoeuvreSubscription, 'unsubscribe');

      component.ionViewDidLeave();
      expect(TestReportBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
      expect(TestReportBasePageComponent.prototype.cancelSubscription).toHaveBeenCalled();
      expect(component.manoeuvreSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
