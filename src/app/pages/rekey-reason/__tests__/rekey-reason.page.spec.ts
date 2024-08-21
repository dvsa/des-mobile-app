import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { ModalControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';

import { AppModule } from '@app/app.module';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { SetExaminerConducted } from '@store/tests/examiner-conducted/examiner-conducted.actions';
import {
  IpadIssueBrokenSelected,
  IpadIssueLostSelected,
  IpadIssueSelected,
  IpadIssueStolenSelected,
  IpadIssueTechFaultSelected,
  OtherReasonUpdated,
  OtherSelected,
  TransferSelected,
} from '@store/tests/rekey-reason/rekey-reason.actions';
import { SendCurrentTest, SendCurrentTestFailure, SendCurrentTestSuccess } from '@store/tests/tests.actions';

import { JOURNAL_PAGE, REKEY_SEARCH_PAGE, TestFlowPageNames } from '@pages/page-names.constants';
import { RekeyReasonPage } from '@pages/rekey-reason/rekey-reason.page';
import { FindUserProviderMock } from '@providers/find-user/__mocks__/find-user.mock';
import { FindUserProvider } from '@providers/find-user/find-user';
import { LoadingProvider } from '@providers/loader/loader';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { getUploadStatus } from '@store/tests/rekey-reason/rekey-reason.selector';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExitRekeyModal } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal';
import { ExitRekeyModalEvent } from '@pages/rekey-reason/components/exit-rekey-modal/exit-rekey-modal.constants';
import { UploadRekeyModal } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal';
import { UploadRekeyModalEvent } from '@pages/rekey-reason/components/upload-rekey-modal/upload-rekey-modal.constants';
import {
  RekeyReasonViewDidEnter,
  RekeyUploadTest,
  ResetStaffNumberValidationError,
  ValidateTransferRekey,
} from '@pages/rekey-reason/rekey-reason.actions';
import { LoaderProviderMock } from '@providers/loader/__mocks__/loader.mock';
import { SetRekeyDate } from '@store/tests/rekey-date/rekey-date.actions';
import { Observable, Subscription } from 'rxjs';
import { IpadIssueComponent } from '../components/ipad-issue/ipad-issue';
import { OtherReasonComponent } from '../components/other-reason/other-reason';
import { TransferComponent } from '../components/transfer/transfer';
import { RekeyReasonModel } from '../rekey-reason.model';
import { rekeyReasonReducer } from '../rekey-reason.reducer';

describe('RekeyReasonPage', () => {
  let fixture: ComponentFixture<RekeyReasonPage>;
  let component: RekeyReasonPage;
  let loaderService: LoadingProvider;
  let modalController: ModalController;
  let store$: Store<AppInfoStateModel>;
  let router: Router;

  beforeEach(waitForAsync(() => {
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
        {
          provide: Router,
          useClass: RouterMock,
        },
        {
          provide: LoadingProvider,
          useClass: LoaderProviderMock,
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
          provide: ModalController,
          useClass: ModalControllerMock,
        },
        {
          provide: FindUserProvider,
          useClass: FindUserProviderMock,
        },
        {
          provide: NavigationStateProvider,
          useClass: NavigationStateProviderMock,
        },
        Store,
      ],
    });

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
        spyOn(modalController, 'create').and.returnValue(
          Promise.resolve({
            present: async () => {},
            onDidDismiss: () => ({ data: 'cancel' }) as OverlayEventDetail,
          } as HTMLIonModalElement)
        );
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
        spyOn(modalController, 'create').and.returnValue(
          Promise.resolve({
            present: async () => {},
            onDidDismiss: () => ({ data: 'cancel' }) as OverlayEventDetail,
          } as HTMLIonModalElement)
        );
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
    describe('ionViewWillEnter', () => {
      it('should setup subscription if merged is present', () => {
        component.merged$ = new Observable<string | boolean>();
        component.ionViewWillEnter();

        expect(component.subscription).toBeDefined();
      });
    });
    describe('isFormValid', () => {
      it('should run markSpecificControlsAsDirty', () => {
        spyOn(component, 'markSpecificControlsAsDirty');
        component.isFormValid();

        expect(component.markSpecificControlsAsDirty).toHaveBeenCalled();
      });
    });
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });
    describe('onUploadRekeyModalDismiss', () => {
      it(
        'should dispatch and SetRekeyDate and ValidateTransferRekey if ' +
          'passed parameter is UploadRekeyModalEvent.UPLOAD and isTransferSelected is true',
        () => {
          component.isTransferSelected = true;
          component.onUploadRekeyModalDismiss(UploadRekeyModalEvent.UPLOAD);
          expect(store$.dispatch).toHaveBeenCalledWith(SetRekeyDate());
          expect(store$.dispatch).toHaveBeenCalledWith(ValidateTransferRekey());
        }
      );
      it(
        'should dispatch and SetRekeyDate, SendCurrentTest and RekeyUploadTest if ' +
          'passed parameter is UploadRekeyModalEvent.UPLOAD and isTransferSelected is false',
        () => {
          component.isTransferSelected = false;
          component.onUploadRekeyModalDismiss(UploadRekeyModalEvent.UPLOAD);
          expect(store$.dispatch).toHaveBeenCalledWith(SetRekeyDate());
          expect(store$.dispatch).toHaveBeenCalledWith(SendCurrentTest());
          expect(store$.dispatch).toHaveBeenCalledWith(RekeyUploadTest());
        }
      );
    });
    describe('onUploadPressed', () => {
      it('should call onShowUploadRekeyModal if isFormValid is true', async () => {
        spyOn(component, 'isFormValid').and.returnValue(true);
        spyOn(component, 'onShowUploadRekeyModal').and.callThrough();
        await component.onUploadPressed();
        expect(component.onShowUploadRekeyModal).toHaveBeenCalled();
      });
    });
    describe('exitRekey', () => {
      it('should run navigate with REKEY_SEARCH_PAGE if fromRekeySearch is true', async () => {
        spyOn(component.router, 'navigate');
        component.fromRekeySearch = true;
        await component.exitRekey();

        expect(component.router.navigate).toHaveBeenCalledWith([REKEY_SEARCH_PAGE]);
      });
      it('should run navigate with JOURNAL_PAGE if fromRekeySearch is false', async () => {
        spyOn(component.router, 'navigate');
        component.fromRekeySearch = false;
        await component.exitRekey();

        expect(component.router.navigate).toHaveBeenCalledWith([JOURNAL_PAGE]);
      });
    });
    describe('markSpecificControlsAsDirty', () => {
      it('should mark relevant fields as dirty if ipadIssueSelected is present ', () => {
        component.formGroup = new UntypedFormGroup({
          ipadIssueSelected: new UntypedFormControl(),
          ipadIssueTechnicalFault: new UntypedFormControl(),
          ipadIssueLost: new UntypedFormControl(),
          ipadIssueStolen: new UntypedFormControl(),
          ipadIssueBroken: new UntypedFormControl(),
          transferSelected: new UntypedFormControl(),
          otherSelected: new UntypedFormControl(),
        });
        component.formGroup.get('ipadIssueSelected').setValue('1');
        component.markSpecificControlsAsDirty();

        expect(component.formGroup.get('ipadIssueTechnicalFault').dirty).toEqual(true);
        expect(component.formGroup.get('ipadIssueLost').dirty).toEqual(true);
        expect(component.formGroup.get('ipadIssueStolen').dirty).toEqual(true);
        expect(component.formGroup.get('ipadIssueBroken').dirty).toEqual(true);
      });
      it('should mark relevant fields as dirty if transferSelected is present ', () => {
        component.formGroup = new UntypedFormGroup({
          ipadIssueSelected: new UntypedFormControl(),
          transferSelected: new UntypedFormControl(),
          otherSelected: new UntypedFormControl(),
          staffNumber: new UntypedFormControl(),
        });
        component.formGroup.get('transferSelected').setValue('1');
        component.markSpecificControlsAsDirty();

        expect(component.formGroup.get('staffNumber').dirty).toEqual(true);
      });
      it('should mark relevant fields as dirty if otherSelected is present ', () => {
        component.formGroup = new UntypedFormGroup({
          ipadIssueSelected: new UntypedFormControl(),
          transferSelected: new UntypedFormControl(),
          otherSelected: new UntypedFormControl(),
          reason: new UntypedFormControl(),
        });
        component.formGroup.get('otherSelected').setValue('1');
        component.markSpecificControlsAsDirty();

        expect(component.formGroup.get('reason').dirty).toEqual(true);
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
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(true, {
          spinner: 'circles',
          message: 'Uploading...',
        });
      });
      it('should display the retry modal when an upload fails', async () => {
        const action = SendCurrentTestFailure(false);
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);
        await component.handleUploadOutcome(uploadStatus);
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(false, {
          spinner: 'circles',
          message: 'Uploading...',
        });
        expect(component.onShowUploadRekeyModal).toHaveBeenCalledWith(true);
      });
      it('should navigate to the next page and not display the retry modal when an upload is a duplicate', async () => {
        const action = SendCurrentTestFailure(true);
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);
        await component.handleUploadOutcome(uploadStatus);
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(false, {
          spinner: 'circles',
          message: 'Uploading...',
        });
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE]);
        expect(component.onShowUploadRekeyModal).not.toHaveBeenCalled();
      });
      it('should navigate to next page and not display the retry modal when an upload succeeds', async () => {
        const action = SendCurrentTestSuccess();
        const result: RekeyReasonModel = rekeyReasonReducer(null, action);
        const uploadStatus = getUploadStatus(result);
        await component.handleUploadOutcome(uploadStatus);
        expect(loaderService.handleUILoading).toHaveBeenCalledWith(false, {
          spinner: 'circles',
          message: 'Uploading...',
        });
        expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.REKEY_UPLOAD_OUTCOME_PAGE]);
        expect(component.onShowUploadRekeyModal).not.toHaveBeenCalled();
      });
    });
  });
});
