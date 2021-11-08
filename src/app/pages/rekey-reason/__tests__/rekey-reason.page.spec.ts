import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import {
  IonicModule, Platform, LoadingController, ModalController,
} from '@ionic/angular';
import {
  PlatformMock, LoadingControllerMock, ModalControllerMock,
} from 'ionic-mocks';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { configureTestSuite } from 'ng-bullet';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AppModule } from '@app/app.module';
import {
  SendCurrentTest,
  SendCurrentTestSuccess,
  SendCurrentTestFailure,
} from '@store/tests/tests.actions';
import {
  IpadIssueSelected,
  OtherSelected,
  OtherReasonUpdated,
  TransferSelected,
  IpadIssueLostSelected,
} from '@store/tests/rekey-reason/rekey-reason.actions';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';
import { FindUserProvider } from '@providers/find-user/find-user';
import { FindUserProviderMock } from '@providers/find-user/__mocks__/find-user.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { RekeyReasonPage } from '@pages/rekey-reason/rekey-reason.page';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { getUploadStatus } from '@store/tests/rekey-reason/rekey-reason.selector';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { IpadIssueComponent } from '../components/ipad-issue/ipad-issue';
import { TransferComponent } from '../components/transfer/transfer';
import { OtherReasonComponent } from '../components/other-reason/other-reason';
import { rekeyReasonReducer } from '../rekey-reason.reducer';
import { RekeyReasonModel } from '../rekey-reason.model';

describe('RekeyReasonPage', () => {
  let fixture: ComponentFixture<RekeyReasonPage>;
  let component: RekeyReasonPage;
  let loadingController: LoadingController;
  let modalController: ModalController;
  let store$: Store<AppInfoStateModel>;
  let router: Router;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        RekeyReasonPage,
        MockComponent(IpadIssueComponent),
        MockComponent(TransferComponent),
        MockComponent(OtherReasonComponent),
      ],
      imports: [
        IonicModule,
        StoreModule.forRoot({
          journal: () => ({
            isLoading: false,
            lastRefreshed: null,
            slots: {},
            selectedDate: '',
            examiner: {
              staffNumber: '1234567',
            },
          }),
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                vehicleDetails: {},
                accompaniment: {},
                testData: {
                  dangerousFaults: {},
                  drivingFaults: {},
                  manoeuvres: {},
                  seriousFaults: {},
                  testRequirements: {},
                  ETA: {},
                  eco: {},
                  vehicleChecks: {
                    showMeQuestion: {
                      code: 'S3',
                      description: '',
                      outcome: '',
                    },
                    tellMeQuestion: {
                      code: '',
                      description: '',
                      outcome: '',
                    },
                  },
                  eyesightTest: {},
                },
                activityCode: '28',
                journalData: {
                  candidate: {
                    candidateName: 'Joe Bloggs',
                    driverNumber: '123',
                  },
                },
                rekey: false,
              },
            },
          }),
          rekeyReason: rekeyReasonReducer,
        }),
        AppModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: LoadingController, useFactory: () => LoadingControllerMock.instance() },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: FindUserProvider, useClass: FindUserProviderMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
        Store,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(RekeyReasonPage);
    component = fixture.componentInstance;
    loadingController = TestBed.inject(LoadingController);
    router = TestBed.inject(Router);
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });

    describe('handleLoadingUI', () => {
      it('should setup a loading spinner when isUploading is set to true', () => {
        component.handleLoadingUI(true);
        expect(component.loadingSpinner).not.toBeNull();
      });
      it('should remove the loading spinner when isUploading is set to false', () => {
        component.loadingSpinner = loadingController.create();
        component.handleLoadingUI(false);
        expect(component.loadingSpinner).toBeNull();
      });
    });

    describe('onShowUploadRekeyModal', () => {
      const options = { cssClass: 'mes-modal-alert text-zoom-regular' };
      it('should display an upload modal', () => {
        component.onShowUploadRekeyModal();
        expect(modalController.create).toHaveBeenCalledWith('UploadRekeyModal', { retryMode: false }, options);
      });
      it('should display an upload modal in retry mode', () => {
        component.onShowUploadRekeyModal(true);
        expect(modalController.create).toHaveBeenCalledWith('UploadRekeyModal', { retryMode: true }, options);
      });
    });

    describe('handleUploadOutcome', () => {
      beforeEach(() => {
        spyOn(component, 'handleLoadingUI');
        spyOn(component, 'onShowUploadRekeyModal');
      });

      it('should display the loading spinner when an upload is in progress', async () => {
        const action = SendCurrentTest();
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);

        await component.handleUploadOutcome(uploadStatus);

        expect(component.handleLoadingUI).toHaveBeenCalledWith(true);
      });
      it('should display the retry modal when an upload fails', async () => {
        const action = SendCurrentTestFailure(false);
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);

        await component.handleUploadOutcome(uploadStatus);

        expect(component.handleLoadingUI).toHaveBeenCalledWith(false);
        expect(component.onShowUploadRekeyModal).toHaveBeenCalledWith(true);

      });
      it('should navigate to the next page and not display the retry modal when an upload is a duplicate', async () => {
        const action = SendCurrentTestFailure(true);
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);

        await component.handleUploadOutcome(uploadStatus);

        expect(component.handleLoadingUI).toHaveBeenCalledWith(false);
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE]);
        expect(component.onShowUploadRekeyModal).not.toHaveBeenCalled();

      });
      it('should navigate to next page and not display the retry modal when an upload succeeds', async () => {
        const action = SendCurrentTestSuccess();
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);

        await component.handleUploadOutcome(uploadStatus);

        expect(component.handleLoadingUI).toHaveBeenCalledWith(false);
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE]);
        expect(component.onShowUploadRekeyModal).not.toHaveBeenCalled();
      });
    });
  });
  describe('DOM', () => {
    it('should pass the ipad issue values to the ipad issue subcomponent', () => {
      store$.dispatch(IpadIssueSelected(true));
      store$.dispatch(IpadIssueLostSelected());
      fixture.detectChanges();
      const ipadIssueElement = fixture.debugElement.query(By.css('ipad-issue'))
        .componentInstance as IpadIssueComponent;
      expect(ipadIssueElement.selected).toEqual(true);
      expect(ipadIssueElement.lost).toEqual(true);
    });
    it('should pass the transfer values to the transfer subcomponent', () => {
      store$.dispatch(TransferSelected(true));
      store$.dispatch(SetExaminerConducted(123));
      fixture.detectChanges();
      const transferElement = fixture.debugElement.query(By.css('transfer'))
        .componentInstance as TransferComponent;
      expect(transferElement.selected).toEqual(true);
      expect(transferElement.staffNumber).toEqual(123);
    });
    it('should pass the other reason values to the reason subcomponent', () => {
      store$.dispatch(OtherSelected(true));
      store$.dispatch(OtherReasonUpdated('Reason text'));
      fixture.detectChanges();
      const otherReasonElement = fixture.debugElement.query(By.css('other-reason'))
        .componentInstance as OtherReasonComponent;
      expect(otherReasonElement.selected).toEqual(true);
      expect(otherReasonElement.reason).toEqual('Reason text');
    });
  });
});
