import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule,
  ModalController,
} from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import {
  PracticeTestReportCardComponent,
} from '@pages/dashboard/components/practice-test-report-card/practice-test-report-card';
import { StoreModel } from '@shared/models/store.model';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { ModalEvent } from '@pages/dashboard/components/practice-test-modal/practice-test-modal.constants';
import { StartTestReportPracticeTest } from '@store/tests/tests.actions';
import {
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { OverlayEventDetail } from '@ionic/core';
import { PracticeTestModal } from '@pages/dashboard/components/practice-test-modal/practice-test-modal';

describe('PracticeTestReportCardComponent', () => {
  let component: PracticeTestReportCardComponent;
  let fixture: ComponentFixture<PracticeTestReportCardComponent>;
  let store$: Store<StoreModel>;
  let routeByCategory: RouteByCategoryProvider;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PracticeTestReportCardComponent],
      imports: [IonicModule, StoreModule.forRoot({})],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(PracticeTestReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routeByCategory = TestBed.inject(RouteByCategoryProvider);
    store$ = TestBed.inject(Store);
    modalController = TestBed.inject(ModalController);
    spyOn(routeByCategory, 'navigateToPage');
    spyOn(store$, 'dispatch');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('showDrivingFaultModal', () => {
      it('should create practice test modal and call through to onModalDismiss', async () => {
        spyOn(component, 'onModalDismiss');
        spyOn(modalController, 'create').and.returnValue(Promise.resolve({
          present: async () => {},
          onDidDismiss: () => ({ data: ModalEvent.CANCEL }) as OverlayEventDetail,
        } as HTMLIonModalElement));

        await component.showDrivingFaultModal();
        expect(modalController.create).toHaveBeenCalledWith({
          id: 'partialPracticeModeModal',
          component: PracticeTestModal,
          cssClass: 'mes-modal-alert text-zoom-regular',
          backdropDismiss: false,
          showBackdrop: true,
        });
        expect(component.onModalDismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
      });
    });
    describe('onModalDismiss', () => {
      it('should start test report practice test with one tell me fault and navigate to test report', async () => {
        await component.onModalDismiss(ModalEvent.FAULT);
        expect(store$.dispatch).toHaveBeenCalledWith(StartTestReportPracticeTest('practice_test_report'));
        expect(store$.dispatch).toHaveBeenCalledWith(TellMeQuestionDrivingFault());
        expect(routeByCategory.navigateToPage).toHaveBeenCalledWith(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.B);
      });
      it('should start test report practice test with no tell me faults and navigate to test report', async () => {
        await component.onModalDismiss(ModalEvent.NO_FAULT);
        expect(store$.dispatch).toHaveBeenCalledWith(StartTestReportPracticeTest('practice_test_report'));
        expect(store$.dispatch).toHaveBeenCalledWith(TellMeQuestionCorrect());
        expect(routeByCategory.navigateToPage).toHaveBeenCalledWith(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.B);
      });
      it('should not dispatch any actions or navigate when cancel is input', async () => {
        await component.onModalDismiss(ModalEvent.CANCEL);
        expect(routeByCategory.navigateToPage).not.toHaveBeenCalled();
      });
      it('should not dispatch any actions or navigate when un-recognised input', async () => {
        await component.onModalDismiss(null);
        expect(routeByCategory.navigateToPage).not.toHaveBeenCalled();
      });
    });
  });
});
