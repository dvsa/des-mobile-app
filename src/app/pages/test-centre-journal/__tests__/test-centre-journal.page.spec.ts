// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { IonicModule } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { RouterTestingModule } from '@angular/router/testing';
// import { configureTestSuite } from 'ng-bullet';
// import { MockStore, provideMockStore } from '@ngrx/store/testing';
//
// import { of } from 'rxjs';
// import { TestCentreJournalPage } from '../test-centre-journal.page';
// import { AuthenticationProvider } from '../../../providers/authentication/authentication';
// import { AuthenticationProviderMock } from '../../../providers/authentication/__mocks__/authentication.mock';
// import { NetworkStateProvider } from '../../../providers/network-state/network-state';
// import { NetworkStateProviderMock } from '../../../providers/network-state/__mocks__/network-state.mock';
// import { TestCentreJournalMock } from '../../../providers/test-centre-journal/__mocks__/test-centre-journal.mock';
// import { TestCentreJournalProvider } from '../../../providers/test-centre-journal/test-centre-journal';
// import { LogHelperMock } from '../../../providers/logs/__mocks__/logs-helper.mock';
// import { LogHelper } from '../../../providers/logs/logs-helper';
// import { StoreModel } from '../../../shared/models/store.model';
// import { StoreModule } from '@ngrx/store';
// import { testCentreJournalReducer } from '../../../../store/test-centre-journal/test-centre-journal.reducer';
//
// fdescribe('TestCenterJournalPage', () => {
//   let component: TestCentreJournalPage;
//   let fixture: ComponentFixture<TestCentreJournalPage>;
//   let store$: MockStore;
//   const initialState = {
//     testCentreJournal: { lastRefreshed: new Date('2021-03-22') },
//   } as StoreModel;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [TestCentreJournalPage],
//       imports: [
//         IonicModule,
//         CommonModule,
//         RouterTestingModule.withRoutes(
//           [
//             { path: '', component: TestCentreJournalPage },
//           ],
//         ),
//         StoreModule.forRoot({}),
//       ],
//       providers: [
//         { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
//         { provide: NetworkStateProvider, useClass: NetworkStateProviderMock },
//         { provide: LogHelper, useClass: LogHelperMock },
//         { provide: TestCentreJournalProvider, useClass: TestCentreJournalMock },
//         provideMockStore({ initialState }),
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(TestCentreJournalPage);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//
//     store$ = TestBed.inject(MockStore);
//   }));
//
//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//
//   describe('ngOnInit', () => {
//     it('should ', () => {
//       const spy = spyOn(store$, 'select').and.returnValue(of());
//       component.ngOnInit();
//       expect(spy).toHaveBeenCalledTimes(1);
//       expect(spy.calls.allArgs()).toEqual([
//         // [selectVersionNumber],
//         // [selectEmployeeName],
//         // [selectEmployeeId],
//         // [selectRole],
//       ]);
//     });
//   });
// });
