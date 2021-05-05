// import { EyesightFailureConfirmationComponent } from '../eyesight-failure-confirmation';
// import { TestBed, ComponentFixture, async } from '@angular/core/testing';
// import { IonicModule, Config, NavController } from 'ionic-angular';
// import { By } from '@angular/platform-browser';
// import { ConfigMock, NavControllerMock } from 'ionic-mocks';
// import { StoreModule, Store } from '@ngrx/store';
// import { testsReducer } from '../../../../../modules/tests/tests.reducer';
// import { StoreModel } from '../../../../../shared/models/store.model';
// import { CAT_B } from '../../../../page-names.constants';
// import { SetActivityCode } from '../../../../../modules/tests/activity-code/activity-code.actions';
// import { configureTestSuite } from 'ng-bullet';
//
// describe('eyesight failure confirmation component', () => {
//   let fixture: ComponentFixture<EyesightFailureConfirmationComponent>;
//   let component: EyesightFailureConfirmationComponent;
//   let navController: NavController;
//   let store$: Store<StoreModel>;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         EyesightFailureConfirmationComponent,
//       ],
//       imports: [
//         IonicModule,
//         StoreModule.forRoot({
//           tests: testsReducer,
//         }),
//       ],
//       providers: [
//         { provide: Config, useFactory: () => ConfigMock.instance() },
//         { provide: NavController, useFactory: () => NavControllerMock.instance() },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(EyesightFailureConfirmationComponent);
//     component = fixture.componentInstance;
//     navController = TestBed.get(NavController);
//     store$ = TestBed.get(Store);
//     spyOn(store$, 'dispatch');
//   }));
//
//   describe('DOM', () => {
//     it('should call the cancel function when cancel is pressed', () => {
//       const cancelSpy = jasmine.createSpy('onCancel');
//       component.cancelFn = cancelSpy;
//       const cancelButton = fixture.debugElement.query(By.css('#cancel-eyesight-failure'));
//       cancelButton.triggerEventHandler('click', null);
//       expect(cancelSpy).toHaveBeenCalled();
//     });
//     it('should navigate to debrief when continue is pressed', () => {
//       const confirmButton = fixture.debugElement.query(By.css('#confirm-eyesight-failure'));
//       component.nextPageOnFail = CAT_B.DEBRIEF_PAGE;
//       confirmButton.triggerEventHandler('click', null);
//       const { calls } = navController.push as jasmine.Spy;
//       expect(calls.argsFor(0)[0]).toBe(CAT_B.DEBRIEF_PAGE);
//     });
//   });
//
//   describe('Class', () => {
//     describe('onContinue', () => {
//       it('should dispatch an action to set the activity code to an eyesight failure', () => {
//         component.onContinue();
//         expect(store$.dispatch).toHaveBeenCalledWith(new SetActivityCode('3'));
//       });
//     });
//   });
// });
