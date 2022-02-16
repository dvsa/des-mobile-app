import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Config, ModalController, NavParams, Platform, ToastController,
} from '@ionic/angular';
import {
  ConfigMock, ModalControllerMock, NavParamsMock, PlatformMock,
} from 'ionic-mocks';
import { MockComponent } from 'ng-mocks';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '@app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { initialState } from '@store/tests/test-data/cat-b/test-data.reducer';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { InsomniaMock } from '@shared/mocks/insomnia.mock';
import { ScreenOrientationMock } from '@shared/mocks/screen-orientation.mock';
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
import { testReportReducer } from '../../test-report.reducer';
import { TestReportCatManoeuvrePage } from '../test-report.cat-manoeuvre.page';

describe('TestReportCatManoeuvrePage', () => {
  let fixture: ComponentFixture<TestReportCatManoeuvrePage>;
  let component: TestReportCatManoeuvrePage;
  let toastController: ToastController;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        TestReportCatManoeuvrePage,
        MockComponent(ToolbarComponent),
        MockComponent(UncoupleRecoupleComponent),
        MockComponent(ReverseManoeuvreComponent),
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
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: DateTimeProvider, useClass: DateTimeProviderMock },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: TestReportValidatorProvider, useClass: TestReportValidatorProviderMock },
        { provide: ScreenOrientation, useClass: ScreenOrientationMock },
        { provide: Insomnia, useClass: InsomniaMock },
        { provide: ToastController, useClass: ToastControllerMock },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestReportCatManoeuvrePage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('manoeuvreHasFaults', () => {
    it('should return true if either of control/observation is defined', () => {
      expect(component.manoeuvreHasFaults({ controlFault: 'D', observationFault: null })).toEqual(true);
    });
    it('should return false if both of control/observation are not set', () => {
      expect(component.manoeuvreHasFaults({ controlFault: null, observationFault: null })).toEqual(false);
    });
  });
  describe('toggleReverseManoeuvre', () => {
    it('should not dispatch select action when faults exist', () => {
      component.manoeuvresHasFaults = true;
      component.toggleReverseManoeuvre();
      expect(store$.dispatch).not.toHaveBeenCalled();
    });
    it('should dispatch select action when no faults exist', () => {
      component.manoeuvresHasFaults = false;
      component.toggleReverseManoeuvre();
      expect(store$.dispatch).toHaveBeenCalledWith(RecordManoeuvresSelection(ManoeuvreTypes.reverseManoeuvre));
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
      spyOn(toastController, 'create').and.returnValue(Promise.resolve({
        present: () => Promise.resolve(),
      } as HTMLIonToastElement));
    });
    it('should not call toast create if toast already exists', async () => {
      spyOn(toastController, 'getTop').and.returnValue(Promise.resolve({} as HTMLIonToastElement));
      await component.competencyClick();
      expect(toastController.create).not.toHaveBeenCalled();
    });
    it('should create toast controller if none already exist', async () => {
      spyOn(toastController, 'getTop').and.returnValue(Promise.resolve(null));
      await component.competencyClick();
      expect(toastController.create).toHaveBeenCalled();
    });
  });
  describe('End Test Button', () => {
    it('should call the end test function', () => {
      spyOn(component, 'onEndTestClick');
      const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
      endTestButton.triggerEventHandler('click', null);
      expect(component.onEndTestClick).toHaveBeenCalled();
    });
  });

});
