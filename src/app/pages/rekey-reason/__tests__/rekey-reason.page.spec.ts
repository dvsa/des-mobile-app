import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import {
  Platform, ModalController,
} from '@ionic/angular';
import {
  PlatformMock, ModalControllerMock,
} from 'ionic-mocks';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { OverlayEventDetail } from '@ionic/core';

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
  IpadIssueLostSelected, IpadIssueTechFaultSelected, IpadIssueStolenSelected, IpadIssueBrokenSelected,
} from '@store/tests/rekey-reason/rekey-reason.actions';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';

import { LoadingProvider } from '@providers/loader/loader';
import { FindUserProvider } from '@providers/find-user/find-user';
import { FindUserProviderMock } from '@providers/find-user/__mocks__/find-user.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { RekeyReasonPage } from '@pages/rekey-reason/rekey-reason.page';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { getUploadStatus } from '@store/tests/rekey-reason/rekey-reason.selector';
import { TestFlowPageNames } from '@pages/page-names.constants';

import { LoaderProviderMock } from '@providers/loader/__mocks__/loader.mock';
import { UploadRekeyModal } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal';
import { UploadRekeyModalEvent } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal.constants';
import { RekeyReasonViewDidEnter, ResetStaffNumberValidationError } from '@pages/rekey-reason/rekey-reason.actions';
import { ExitRekeyModalEvent } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal.constants';
import { ExitRekeyModal } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IpadIssueComponent } from '../components/ipad-issue/ipad-issue';
import { TransferComponent } from '../components/transfer/transfer';
import { OtherReasonComponent } from '../components/other-reason/other-reason';
import { rekeyReasonReducer } from '../rekey-reason.reducer';
import { RekeyReasonModel } from '../rekey-reason.model';

describe('RekeyReasonPage', () => {
  let fixture: ComponentFixture<RekeyReasonPage>;
  let component: RekeyReasonPage;
  let loaderService: LoadingProvider;
  let modalController: ModalController;
  let store$: Store<AppInfoStateModel>;
  let router: Router;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        RekeyReasonPage,
        MockComponent(IpadIssueComponent),
        MockComponent(TransferComponent),
        MockComponent(OtherReasonComponent),
      ],
      imports: [
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
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LoadingProvider, useClass: LoaderProviderMock },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
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
    loaderService = TestBed.inject(LoadingProvider);
    router = TestBed.inject(Router);
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should create', () => {
      expect(component).toBeDefined();
    });
    describe('ionViewDidEnter', () => {
      it('should dispatch the did enter action', () => {
        component.ionViewDidEnter();
        expect(store$.dispatch).toHaveBeenCalledWith(RekeyReasonViewDidEnter());
      });
    });
    describe('ipadIssueSelected', () => {
      it('should dispatch the ipad issue action', () => {
        component.ipadIssueSelected(true);
        expect(store$.dispatch).toHaveBeenCalledWith(IpadIssueSelected(true));
      });
    });
    describe('ipadIssueTechnicalFaultChanged', () => {
      it('should dispatch the ipad tech fault action', () => {
        component.ipadIssueTechnicalFaultChanged();
        expect(store$.dispatch).toHaveBeenCalledWith(IpadIssueTechFaultSelected());
      });
    });
    describe('ipadIssueLostChanged', () => {
      it('should dispatch the ipad lost action', () => {
        component.ipadIssueLostChanged();
        expect(store$.dispatch).toHaveBeenCalledWith(IpadIssueLostSelected());
      });
    });
    describe('ipadIssueStolenChanged', () => {
      it('should dispatch the ipad stolen action', () => {
        component.ipadIssueStolenChanged();
        expect(store$.dispatch).toHaveBeenCalledWith(IpadIssueStolenSelected());
      });
    });
    describe('ipadIssueBrokenChanged', () => {
      it('should dispatch the ipad broken selected action', () => {
        component.ipadIssueBrokenChanged();
        expect(store$.dispatch).toHaveBeenCalledWith(IpadIssueBrokenSelected());
      });
    });
    describe('otherSelected', () => {
      it('should dispatch the other selected action', () => {
        component.otherSelected(true);
        expect(store$.dispatch).toHaveBeenCalledWith(OtherSelected(true));
      });
    });
    describe('otherReasonChanged', () => {
      it('should dispatch the other reason action', () => {
        component.otherReasonChanged('reason');
        expect(store$.dispatch).toHaveBeenCalledWith(OtherReasonUpdated('reason'));
      });
    });
    describe('transferSelected', () => {
      it('should dispatch the transfer selected regardless of the value of isChecked', () => {
        component.transferSelected(true);
        expect(store$.dispatch).toHaveBeenCalledWith(TransferSelected(true));
      });
      it('should dispatch the set examiner conducted action only', () => {
        component.transferSelected(true);
        expect(store$.dispatch).toHaveBeenCalledWith(SetExaminerConducted(null));
        expect(store$.dispatch).not.toHaveBeenCalledWith(ResetStaffNumberValidationError());
      });
      it('should dispatch the set examiner with the examinerKeyed and the reset action', () => {
        component.transferSelected(false);
        expect(store$.dispatch).toHaveBeenCalledWith(SetExaminerConducted(component.examinerKeyed));
        expect(store$.dispatch).toHaveBeenCalledWith(ResetStaffNumberValidationError());
      });
    });
    describe('staffNumberChanged', () => {
      it('should dispatch the reset staff number action when isStaffNumberInvalid is true', () => {
        component.isStaffNumberInvalid = true;
        component.staffNumberChanged(123);
        expect(store$.dispatch).toHaveBeenCalledWith(ResetStaffNumberValidationError());
      });
      it('should dispatch the set examiner action when isStaffNumberInvalid is false', () => {
        component.isStaffNumberInvalid = false;
        component.staffNumberChanged(123);
        expect(store$.dispatch).toHaveBeenCalledWith(SetExaminerConducted(123));
      });
    });
    describe('onExitRekeyPressed', () => {
      it('should call through to showExitRekeyModal', async () => {
        spyOn(component, 'showExitRekeyModal');
        await component.onExitRekeyPressed();
        expect(component.showExitRekeyModal).toHaveBeenCalled();
      });
    });
    describe('onExitRekeyModalDismiss', () => {
      beforeEach(() => {
        spyOn(component, 'exitRekey');
      });
      it('should not call exitRekey when modal event is CANCEL', async () => {
        await component.onExitRekeyModalDismiss(ExitRekeyModalEvent.CANCEL);
        expect(component.exitRekey).not.toHaveBeenCalled();
      });
      it('should call exitRekey when modal event is EXIT_REKEY', async () => {
        await component.onExitRekeyModalDismiss(ExitRekeyModalEvent.EXIT_REKEY);
        expect(component.exitRekey).toHaveBeenCalled();
      });
    });
    describe('canClickUploadRekeyTest', () => {
      it('should return true if any of ipadIssue/transfer/other are selected', async () => {
        expect(component.canClickUploadRekeyTest({ selected: true }, null, null)).toEqual(true);
        expect(component.canClickUploadRekeyTest(null, { selected: true }, null)).toEqual(true);
        expect(component.canClickUploadRekeyTest(null, null, { selected: true })).toEqual(true);
        expect(component.canClickUploadRekeyTest(null, null, null)).toEqual(false);
      });
    });
    describe('showExitRekeyModal', () => {
      it('should display an exit rekey modal', async () => {
        spyOn(modalController, 'create').and.returnValue(Promise.resolve({
          present: async () => {},
          onDidDismiss: () => ({ data: 'cancel' }) as OverlayEventDetail,
        } as HTMLIonModalElement));
        spyOn(component, 'onExitRekeyModalDismiss');

        await component.showExitRekeyModal();

        expect(modalController.create).toHaveBeenCalledWith({
          component: ExitRekeyModal,
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
        expect(component.onExitRekeyModalDismiss).toHaveBeenCalledWith('cancel' as ExitRekeyModalEvent);
      });
    });
    describe('onShowUploadRekeyModal', () => {
      it('should display an upload modal', async () => {
        spyOn(modalController, 'create').and.returnValue(Promise.resolve({
          present: async () => {},
          onDidDismiss: () => ({ data: 'cancel' }) as OverlayEventDetail,
        } as HTMLIonModalElement));
        spyOn(component, 'onUploadRekeyModalDismiss');

        await component.onShowUploadRekeyModal(true);

        expect(modalController.create).toHaveBeenCalledWith({
          component: UploadRekeyModal,
          componentProps: { retryMode: true },
          cssClass: 'mes-modal-alert text-zoom-regular',
        });
        expect(component.onUploadRekeyModalDismiss).toHaveBeenCalledWith('cancel' as UploadRekeyModalEvent);
      });
    });
    describe('handleUploadOutcome', () => {
      beforeEach(() => {
        spyOn(loaderService, 'handleUILoading');
        spyOn(component, 'onShowUploadRekeyModal');
      });
      it('should display the loading spinner when an upload is in progress', async () => {
        const action = SendCurrentTest();
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);
        await component.handleUploadOutcome(uploadStatus);
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(
          true, { spinner: 'circles', message: 'Uploading...' },
        );
      });
      it('should display the retry modal when an upload fails', async () => {
        const action = SendCurrentTestFailure(false);
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);
        await component.handleUploadOutcome(uploadStatus);
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(
          false, { spinner: 'circles', message: 'Uploading...' },
        );
        expect(component.onShowUploadRekeyModal).toHaveBeenCalledWith(true);
      });
      it('should navigate to the next page and not display the retry modal when an upload is a duplicate', async () => {
        const action = SendCurrentTestFailure(true);
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);
        await component.handleUploadOutcome(uploadStatus);
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(
          false, { spinner: 'circles', message: 'Uploading...' },
        );
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE]);
        expect(component.onShowUploadRekeyModal).not.toHaveBeenCalled();
      });
      it('should navigate to next page and not display the retry modal when an upload succeeds', async () => {
        const action = SendCurrentTestSuccess();
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);
        await component.handleUploadOutcome(uploadStatus);
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(
          false, { spinner: 'circles', message: 'Uploading...' },
        );
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE]);
        expect(component.onShowUploadRekeyModal).not.toHaveBeenCalled();
      });
    });
  });
});
