import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ModalControllerMock, NavControllerMock } from 'ionic-mocks';
// import {
//   CAT_B,
//   CAT_BE,
//   CAT_C,
//   CAT_D,
//   CAT_A_MOD1,
//   CAT_A_MOD2,
//   CAT_ADI_PART2,
//   CAT_CPC,
// } from '@pages/page-names.constants';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '../../../../app/app.module';
import { EndTestLinkComponent } from '../end-test-link';

describe('EndTestLinkComponent', () => {
  let fixture: ComponentFixture<EndTestLinkComponent>;
  let component: EndTestLinkComponent;
  let modalController: ModalController;
  let navController: NavController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EndTestLinkComponent],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EndTestLinkComponent);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    navController = TestBed.inject(NavController);
  }));

  describe('DOM', () => {
    describe('opening test termination confirmation modal', () => {
      it('should open a modal for test termination', () => {
        component.openEndTestModal();
        expect(modalController.create).toHaveBeenCalled();
        const { calls } = modalController.create as jasmine.Spy;
        expect(calls.argsFor(0)[0]).toBe('TerminateTestModal');
      });
      it('should pass the termination and cancellation callbacks to the modal creation', () => {
        component.openEndTestModal();
        expect(modalController.create).toHaveBeenCalled();
        const { calls } = modalController.create as jasmine.Spy;
        const navParams = calls.argsFor(0)[1];
        expect(navParams.onCancel).toBe(component.onCancel);
        expect(navParams.onTerminate).toBe(component.onTerminate);
      });
    });
  });

  // describe('Class', () => {
  //   describe('onTerminate', () => {
  //     it('should dismiss the termination confirmation dialog and navigate to CAT B debrief', () => {
  //       component.category = 'B';
  //       component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //       component.onTerminate();
  //       expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //       const { calls } = navController.push as jasmine.Spy;
  //       expect(calls.argsFor(0)[0]).toBe(CAT_B.DEBRIEF_PAGE);
  //     });
  //
  //     it('should dismiss the termination confirmation dialog and navigate to CAT BE debrief', () => {
  //       component.category = 'B+E';
  //       component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //       component.onTerminate();
  //       expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //       const { calls } = navController.push as jasmine.Spy;
  //       expect(calls.argsFor(0)[0]).toBe(CAT_BE.DEBRIEF_PAGE);
  //     });
  //
  //     it('should dismiss the termination confirmation dialog and navigate to CAT C debrief', () => {
  //       component.category = 'C';
  //       component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //       component.onTerminate();
  //       expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //       const { calls } = navController.push as jasmine.Spy;
  //       expect(calls.argsFor(0)[0]).toBe(CAT_C.DEBRIEF_PAGE);
  //     });
  //
  //     it('should dismiss the termination confirmation dialog and navigate to CAT D debrief', () => {
  //       component.category = 'D';
  //       component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //       component.onTerminate();
  //       expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //       const { calls } = navController.push as jasmine.Spy;
  //       expect(calls.argsFor(0)[0]).toBe(CAT_D.DEBRIEF_PAGE);
  //     });
  //
  //     const testCasesCatAMod1 = [
  //       { category: 'EUA1M1' },
  //       { category: 'EUA2M1' },
  //       { category: 'EUAM1' },
  //       { category: 'EUAMM1' },
  //     ];
  //
  //     testCasesCatAMod1.forEach((test) => {
  //       it(`should dismiss the termination dialog and navigate to CAT A Mod 1 (${test.category}) debrief`, () => {
  //         component.category = test.category;
  //         component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //         component.onTerminate();
  //         expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //         const { calls } = navController.push as jasmine.Spy;
  //         expect(calls.argsFor(0)[0]).toBe(CAT_A_MOD1.DEBRIEF_PAGE);
  //       });
  //     });
  //
  //     const testCasesCatAMod2 = [
  //       { category: 'EUA1M2' },
  //       { category: 'EUA2M2' },
  //       { category: 'EUAM2' },
  //       { category: 'EUAMM2' },
  //     ];
  //
  //     testCasesCatAMod2.forEach((test) => {
  //       it(`should dismiss the termination dialog and navigate to CAT A Mod 2 (${test.category}) debrief`, () => {
  //         component.category = test.category;
  //         component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //         component.onTerminate();
  //         expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //         const { calls } = navController.push as jasmine.Spy;
  //         expect(calls.argsFor(0)[0]).toBe(CAT_A_MOD2.DEBRIEF_PAGE);
  //       });
  //     });
  //
  //     it('should dismiss the termination confirmation dialog and navigate to CAT ADI2 debrief', () => {
  //       component.category = 'ADI2';
  //       component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //       component.onTerminate();
  //       expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //       const { calls } = navController.push as jasmine.Spy;
  //       expect(calls.argsFor(0)[0]).toBe(CAT_ADI_PART2.DEBRIEF_PAGE);
  //     });
  //
  //     describe('delegate tests navigate to Office page', () => {
  //
  //       beforeEach(() => {
  //         component.isDelegated = true;
  //       });
  //
  //       it('should dismiss the termination confirmation dialog and navigate to CAT BE Office Page', () => {
  //         component.category = 'B+E';
  //         component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //         component.onTerminate();
  //         expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //         const { calls } = navController.push as jasmine.Spy;
  //         expect(calls.argsFor(0)[0]).toBe(CAT_BE.OFFICE_PAGE);
  //       });
  //
  //       it('should dismiss the termination confirmation dialog and navigate to CAT C Office Page', () => {
  //         component.category = 'C';
  //         component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //         component.onTerminate();
  //         expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //         const { calls } = navController.push as jasmine.Spy;
  //         expect(calls.argsFor(0)[0]).toBe(CAT_C.OFFICE_PAGE);
  //       });
  //
  //       it('should dismiss the termination confirmation dialog and navigate to CAT (C)CPC Office Page', () => {
  //         component.category = 'CCPC';
  //         component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //         component.onTerminate();
  //         expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //         const { calls } = navController.push as jasmine.Spy;
  //         expect(calls.argsFor(0)[0]).toBe(CAT_CPC.OFFICE_PAGE);
  //       });
  //
  //       it('should dismiss the termination confirmation dialog and navigate to CAT (D)CPC Office Page', () => {
  //         component.category = 'DCPC';
  //         component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //         component.onTerminate();
  //         expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //         const { calls } = navController.push as jasmine.Spy;
  //         expect(calls.argsFor(0)[0]).toBe(CAT_CPC.OFFICE_PAGE);
  //       });
  //
  //       it('should dismiss the termination confirmation dialog and navigate to CAT D Office Page', () => {
  //         component.category = 'D';
  //         component.terminateTestModal = jasmine.createSpyObj('terminateTestModal', ['dismiss']);
  //         component.onTerminate();
  //         expect(component.terminateTestModal.dismiss).toHaveBeenCalled();
  //         const { calls } = navController.push as jasmine.Spy;
  //         expect(calls.argsFor(0)[0]).toBe(CAT_D.OFFICE_PAGE);
  //       });
  //     });
  //
  //   });
  // });
});
