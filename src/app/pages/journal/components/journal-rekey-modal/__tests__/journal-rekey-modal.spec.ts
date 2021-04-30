// import { JournalRekeyModal } from './journal-rekey-modal';
// import { ComponentFixture, async, TestBed } from '@angular/core/testing';
// import { AppModule } from '../../../app/app.module';
// import { IonicModule, NavParams, ViewController } from 'ionic-angular';
// import { NavParamsMock, ViewControllerMock } from 'ionic-mocks';
// import { By } from '@angular/platform-browser';
// import { ComponentsModule } from '../../../components/common/common-components.module';
// import { DeviceProvider } from '@providers/device/device';
// import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
// import { LogHelper } from '../../../providers/logs/logsHelper';
// import { LogHelperMock } from '../../../providers/logs/__mocks__/logsHelper.mock';
// import { configureTestSuite } from 'ng-bullet';
//
// describe('JournalRekeyModal', () => {
//   let fixture: ComponentFixture<JournalRekeyModal>;
//   let component: JournalRekeyModal;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         JournalRekeyModal,
//       ],
//       imports: [
//         AppModule,
//         IonicModule,
//         ComponentsModule,
//       ],
//       providers: [
//         { provide: NavParams, useFactory: () => NavParamsMock.instance() },
//         { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
//         { provide: DeviceProvider, useClass: DeviceProviderMock },
//         { provide: LogHelper, useClass: LogHelperMock },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(JournalRekeyModal);
//     component = fixture.componentInstance;
//     component.onStartTest = () => {
//     };
//     component.onRekeyTest = () => {
//     };
//     component.onCancel = () => {
//     };
//   }));
//
//   describe('DOM', () => {
//     it('should call onStartTest when the Start test button is clicked', () => {
//       fixture.detectChanges();
//       spyOn(component, 'onStartTest');
//       const button = fixture.debugElement.query(By.css('button.start-test-button'));
//       button.triggerEventHandler('click', null);
//
//       fixture.detectChanges();
//       expect(component.onStartTest).toHaveBeenCalled();
//     });
//
//     it('should call onRekeyTest when the Rekey a paper test button is clicked', () => {
//       fixture.detectChanges();
//       spyOn(component, 'onRekeyTest');
//       const button = fixture.debugElement.query(By.css('button.rekey-test-button'));
//       button.triggerEventHandler('click', null);
//
//       fixture.detectChanges();
//       expect(component.onRekeyTest).toHaveBeenCalled();
//     });
//
//     it('should call onCancel when the Cancel button is clicked', () => {
//       fixture.detectChanges();
//       spyOn(component, 'onCancel');
//       const button = fixture.debugElement.query(By.css('button.cancel-button'));
//       button.triggerEventHandler('click', null);
//
//       fixture.detectChanges();
//       expect(component.onCancel).toHaveBeenCalled();
//     });
//   });
// });
