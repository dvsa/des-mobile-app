// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { JournalEarlyStartModal } from '../journal-early-start-modal';
// import { AppModule } from '../../../../../app/app.module';
// import { ViewControllerMock } from 'ionic-mocks';
// import { IonicModule, NavParams, ViewController } from 'ionic-angular';
// import { ComponentsModule } from '../../../../../components/common/common-components.module';
// import { JournalEarlyStartModalMock } from '../__mocks__/journal-early-start-modal.mock';
// import { NavParamsMock } from '../__mocks__/nav-params.mock';
// import { By } from '@angular/platform-browser';
// import { configureTestSuite } from 'ng-bullet';
// import { EarlyStartDidContinue, EarlyStartDidReturn } from '../../../../../modules/journal/journal.actions';
// import { ModalEvent } from '../journal-early-start-modal.constants';
//
// describe('JournalEarlyStartModal', () => {
//   let modalFixture: ComponentFixture<JournalEarlyStartModal>;
//   let modalComponent: JournalEarlyStartModal;
//   const mockFile: JournalEarlyStartModalMock = new JournalEarlyStartModalMock();
//   const navMock: NavParamsMock = new NavParamsMock();
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         JournalEarlyStartModal,
//       ],
//       imports: [
//         AppModule,
//         IonicModule,
//         ComponentsModule,
//       ],
//       providers: [
//         { provide: ViewController, useFactory: () => ViewControllerMock.instance() } ,
//         { provide: NavParams, useFactory: () => navMock },
//       ],
//     });
//   });
//   beforeEach(async(() => {
//     const mockValue = mockFile.mockSlotDetail();
//     spyOn(navMock, 'get').and.returnValue(mockValue);
//     modalFixture = TestBed.createComponent(JournalEarlyStartModal);
//     modalComponent = modalFixture.componentInstance;
//     spyOn(modalComponent.store$, 'dispatch').and.callFake(() => {});
//   }));
//   it('should return slot details from nav param', () => {
//     modalFixture.detectChanges();
//     const slotData = modalComponent.getSlotData();
//     const mockValue = mockFile.mockSlotDetail();
//     expect(slotData).toEqual(mockValue);
//   });
//   it('should call onStart when the Start test button is clicked', () => {
//     modalFixture.detectChanges();
//     spyOn(modalComponent, 'onStart').and.callThrough();
//     const button = modalFixture.debugElement.query(By.css('.start-test-button'));
//     button.triggerEventHandler('click', null);
//     modalFixture.detectChanges();
//     expect(modalComponent.onStart).toHaveBeenCalled();
//     expect(modalComponent.store$.dispatch).toHaveBeenCalledWith(new EarlyStartDidContinue());
//     expect(modalComponent.viewCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.START);
//   });
//   it('should call onCancel when the Cancel button is clicked', () => {
//     modalFixture.detectChanges();
//     spyOn(modalComponent, 'onCancel').and.callThrough();
//     const button = modalFixture.debugElement.query(By.css('.cancel-button'));
//     button.triggerEventHandler('click', null);
//     modalFixture.detectChanges();
//     expect(modalComponent.onCancel).toHaveBeenCalled();
//     expect(modalComponent.store$.dispatch).toHaveBeenCalledWith(new EarlyStartDidReturn());
//     expect(modalComponent.viewCtrl.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
//   });
// });
