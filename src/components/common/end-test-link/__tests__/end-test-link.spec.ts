import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import {
  CAT_B,
  CAT_BE,
  CAT_C,
  CAT_D,
  CAT_A_MOD1,
  CAT_A_MOD2,
  CAT_ADI_PART2,
  CAT_CPC, CAT_HOME_TEST,
} from '@pages/page-names.constants';
import { AppModule } from '../../../../app/app.module';
import { EndTestLinkComponent } from '../end-test-link';

xdescribe('EndTestLinkComponent', () => {
  let fixture: ComponentFixture<EndTestLinkComponent>;
  let component: EndTestLinkComponent;
  let modalController: ModalController;
  let router: Router;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EndTestLinkComponent],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: Router, useClass: RouterMock },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EndTestLinkComponent);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    router = TestBed.inject(Router);
  }));

  // describe('DOM', () => {
  //   beforeEach(() => {
  //     spyOn(modalController, 'create').and.returnValue(Promise.resolve({
  //       present: () => Promise.resolve(),
  //     } as HTMLIonModalElement));
  //   });
  //   describe('opening test termination confirmation modal', () => {
  //     it('should open a modal for test termination', () => {
  //       component.openEndTestModal();
  //       expect(modalController.create).toHaveBeenCalled();
  //       const { calls } = modalController.create as jasmine.Spy;
  //       expect(calls.argsFor(0)[0].id).toBe('TerminateTestModal');
  //     });
  //     it('should pass the termination and cancellation callbacks to the modal creation', () => {
  //     component.openEndTestModal();
  //     expect(modalController.create).toHaveBeenCalled();
  //     const { calls } = modalController.create as jasmine.Spy;
  //     const navParams = calls.argsFor(0)[1];
  //     expect(navParams.onCancel).toBe(component.onCancel);
  //     expect(navParams.onTerminate).toBe(component.onTerminate);
  //     });
  //   });
  // });

  describe('Class', () => {
    describe('onTerminate', () => {
      beforeEach(() => {
        spyOn(component, 'navigateToOfficePage');
        spyOn(router, 'navigate');
        component.terminateTestModal = {
          dismiss: () => Promise.resolve(true),
        } as HTMLIonModalElement;
        component.isDelegated = false;
      });
      it('should navigate straight to office when delegated', async () => {
        component.isDelegated = true;
        await component.onTerminate();
        expect(component.navigateToOfficePage).toHaveBeenCalled();
      });
      it('should navigate to ADI debrief page', async () => {
        component.category = TestCategory.ADI2;
        await component.onTerminate();
        expect(router.navigate).toHaveBeenCalledWith([CAT_ADI_PART2.DEBRIEF_PAGE]);
      });
      it('should navigate to B debrief page', async () => {
        component.category = TestCategory.B;
        await component.onTerminate();
        expect(router.navigate).toHaveBeenCalledWith([CAT_B.DEBRIEF_PAGE]);
      });
      it('should navigate to BE debrief page', async () => {
        component.category = TestCategory.BE;
        await component.onTerminate();
        expect(router.navigate).toHaveBeenCalledWith([CAT_BE.DEBRIEF_PAGE]);
      });
      it('should navigate to C debrief page', async () => {
        for (const category of [TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E]) {
          component.category = category;
          await component.onTerminate();
          expect(router.navigate).toHaveBeenCalledWith([CAT_C.DEBRIEF_PAGE]);
        }
      });
      it('should navigate to CPC debrief page', async () => {
        for (const category of [TestCategory.CCPC, TestCategory.DCPC]) {
          component.category = category;
          await component.onTerminate();
          expect(router.navigate).toHaveBeenCalledWith([CAT_CPC.DEBRIEF_PAGE]);
        }
      });
      it('should navigate to D debrief page', async () => {
        for (const category of [TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E]) {
          component.category = category;
          await component.onTerminate();
          expect(router.navigate).toHaveBeenCalledWith([CAT_D.DEBRIEF_PAGE]);
        }
      });
      it('should navigate to home test debrief page', async () => {
        for (const category of [TestCategory.F, TestCategory.G, TestCategory.H, TestCategory.K]) {
          component.category = category;
          await component.onTerminate();
          expect(router.navigate).toHaveBeenCalledWith([CAT_HOME_TEST.DEBRIEF_PAGE]);
        }
      });
      it('should navigate to MOD1 debrief page', async () => {
        for (const category of [TestCategory.EUA1M1, TestCategory.EUA2M1, TestCategory.EUAM1, TestCategory.EUAMM1]) {
          component.category = category;
          await component.onTerminate();
          expect(router.navigate).toHaveBeenCalledWith([CAT_A_MOD1.DEBRIEF_PAGE]);
        }
      });
      it('should navigate to MOD2 debrief page', async () => {
        for (const category of [TestCategory.EUA1M2, TestCategory.EUA2M2, TestCategory.EUAM2, TestCategory.EUAMM2]) {
          component.category = category;
          await component.onTerminate();
          expect(router.navigate).toHaveBeenCalledWith([CAT_A_MOD2.DEBRIEF_PAGE]);
        }
      });
    });

    describe('navigateToOfficePage', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
      });
      it('should navigate to BE office page', async () => {
        component.category = TestCategory.BE;
        await component.navigateToOfficePage();
        expect(router.navigate).toHaveBeenCalledWith([CAT_BE.OFFICE_PAGE]);
      });
      it('should navigate to C office page', async () => {
        for (const category of [TestCategory.C, TestCategory.C1, TestCategory.CE, TestCategory.C1E]) {
          component.category = category;
          await component.navigateToOfficePage();
          expect(router.navigate).toHaveBeenCalledWith([CAT_C.OFFICE_PAGE]);
        }
      });
      it('should navigate to CPC office page', async () => {
        for (const category of [TestCategory.CCPC, TestCategory.DCPC]) {
          component.category = category;
          await component.navigateToOfficePage();
          expect(router.navigate).toHaveBeenCalledWith([CAT_CPC.OFFICE_PAGE]);
        }
      });
      it('should navigate to D office page', async () => {
        for (const category of [TestCategory.D, TestCategory.D1, TestCategory.DE, TestCategory.D1E]) {
          component.category = category;
          await component.navigateToOfficePage();
          expect(router.navigate).toHaveBeenCalledWith([CAT_D.OFFICE_PAGE]);
        }
      });
    });
  });
});
