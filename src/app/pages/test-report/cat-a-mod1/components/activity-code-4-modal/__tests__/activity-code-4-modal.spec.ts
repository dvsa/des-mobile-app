// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivityCode4Modal } from '../activity-code-4-modal';
// import { configureTestSuite } from 'ng-bullet';
// import { AppModule } from '../../../../../../app/app.module';
// import { IonicModule, NavParams, ViewController } from 'ionic-angular';
// import { ComponentsModule } from '../../../../../../components/common/common-components.module';
// import { ViewControllerMock } from 'ionic-mocks';
// import { ModalReason } from '../activity-code-4-modal.constants';
// import { NavParamsMock } from '../../../../../journal/components/journal-early-start-modal/__mocks__/nav-params.mock';
// import { By } from '@angular/platform-browser';
//
// describe('ActivityCode4Modal', () => {
//   let fixture: ComponentFixture<ActivityCode4Modal>;
//   let component: ActivityCode4Modal;
//   const navMock: NavParamsMock = new NavParamsMock();
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         ActivityCode4Modal,
//       ],
//       imports: [
//         AppModule,
//         IonicModule,
//         ComponentsModule,
//       ],
//       providers: [
//         { provide: NavParams, useFactory: () => navMock },
//         { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(ActivityCode4Modal);
//     component = fixture.componentInstance;
//   }));
//
//   describe('Class', () => {
//     it('should set modalReason from navParams', () => {
//       spyOn(navMock, 'get').and.returnValue(ModalReason.SPEED_REQUIREMENTS);
//       component.ngOnInit();
//       expect(navMock.get).toHaveBeenCalledWith('modalReason');
//       expect(component.modalReason).toEqual(ModalReason.SPEED_REQUIREMENTS);
//     });
//   });
//
//   describe('DOM', () => {
//
//     it('should call onCancel when the return to journal button is clicked', () => {
//       fixture.detectChanges();
//       spyOn(component, 'onCancel');
//       const button = fixture.debugElement.query(By.css('button.return-button'));
//       button.triggerEventHandler('click', null);
//
//       fixture.detectChanges();
//       expect(component.onCancel).toHaveBeenCalled();
//     });
//
//     it('should call onEndTest when the return to journal button is clicked', () => {
//       fixture.detectChanges();
//       spyOn(component, 'onEndTest');
//       const button = fixture.debugElement.query(By.css('button.end-test-button'));
//       button.triggerEventHandler('click', null);
//
//       fixture.detectChanges();
//       expect(component.onEndTest).toHaveBeenCalled();
//     });
//
//   });
//
// });
