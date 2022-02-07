// import { ComponentFixture, async, TestBed } from '@angular/core/testing';
// import { IonicModule, NavParams, ViewController } from 'ionic-angular';
// import { NavParamsMock, ViewControllerMock } from 'ionic-mocks';
// import { AppModule } from '../../../../../../app/app.module';
// import { By } from '@angular/platform-browser';
// import { ComponentsModule } from '../../../../../../components/common/common-components.module';
// import { configureTestSuite } from 'ng-bullet';
// import { SpeedCheckModal } from '../speed-check-modal';
//
// describe('SpeedCheckModal', () => {
//   let fixture: ComponentFixture<SpeedCheckModal>;
//   let component: SpeedCheckModal;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         SpeedCheckModal,
//       ],
//       imports: [
//         AppModule,
//         IonicModule,
//         ComponentsModule,
//       ],
//       providers: [
//         { provide: NavParams, useFactory: () => NavParamsMock.instance() },
//         { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(SpeedCheckModal);
//     component = fixture.componentInstance;
//     component.onCancel = () => {
//     };
//     component.onTerminate = () => {
//     };
//   }));
//
//   describe('DOM', () => {
//     it('should call onCancel when the Return to test button is clicked', () => {
//       component.speedChecksNeedCompleting = [];
//       fixture.detectChanges();
//       spyOn(component, 'onCancel');
//       const button = fixture.debugElement.query(By.css('button.modal-return-button'));
//       button.triggerEventHandler('click', null);
//
//       fixture.detectChanges();
//       expect(component.onCancel).toHaveBeenCalled();
//     });
//
//     it('should call onTerminate when the Terminate test button is clicked', () => {
//       component.speedChecksNeedCompleting = [];
//       fixture.detectChanges();
//       spyOn(component, 'onTerminate');
//       const button = fixture.debugElement.query(By.css('button.terminate-button'));
//       button.triggerEventHandler('click', null);
//
//       fixture.detectChanges();
//       expect(component.onTerminate).toHaveBeenCalled();
//     });
//   });
// });
