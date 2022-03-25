//
// import { ComponentFixture, async, TestBed } from '@angular/core/testing';
// import { IonicModule, Config, NavController } from 'ionic-angular';
// import { VehicleChecksCatAMod2Modal } from '../vehicle-checks-modal.cat-a-mod2.page';
// import { Store, StoreModule } from '@ngrx/store';
// import { ConfigMock, NavControllerMock } from 'ionic-mocks';
// import { AppModule } from '../../../../../../app/app.module';
// import { MockComponent } from 'ng-mocks';
// import { VehicleChecksQuestionComponent } from '../../vehicle-checks-question/vehicle-checks-question';
// import {
//   QuestionOutcome,
//   QuestionResult,
// } from '@dvsa/mes-test-schema/categories/common';
// import { StoreModel } from '../../../../../../shared/models/store.model';
// import { WarningBannerComponent } from '../../../../../../components/common/warning-banner/warning-banner';
// import { configureTestSuite } from 'ng-bullet';
// import { SafetyQuestionOutcomeChanged, BalanceQuestionSelected, SafetyQuestionSelected, BalanceQuestionOutcomeChanged }
// from '../../../../../../modules/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
//
// describe('VehicleChecksCatAMod2Modal', () => {
//   let fixture: ComponentFixture<VehicleChecksCatAMod2Modal>;
//   let component: VehicleChecksCatAMod2Modal;
//   let store$: Store<StoreModel>;
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         VehicleChecksCatAMod2Modal,
//         MockComponent(VehicleChecksQuestionComponent),
//         WarningBannerComponent,
//       ],
//       imports: [
//         IonicModule,
//         AppModule,
//         StoreModule.forRoot({}),
//       ],
//       providers: [
//         { provide: Config, useFactory: () => ConfigMock.instance() },
//         { provide: NavController, useFactory: () => NavControllerMock.instance() },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(VehicleChecksCatAMod2Modal);
//     component = fixture.componentInstance;
//     store$ = TestBed.get(Store);
//     spyOn(store$, 'dispatch');
//
//   }));
//
//   describe('Class', () => {
//     it('should compile', () => {
//       expect(component).toBeDefined();
//     });
//
//     describe('safetyQuestionChanged()', () => {
//       it('should dispatch a new ShowMeQuestionSelected action', () => {
//         const safetyQuestionPayload: QuestionResult = {
//           code: '01',
//           description: 'desc',
//           outcome: 'P',
//         };
//         const index = 1;
//         component.safetyQuestionChanged(safetyQuestionPayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new SafetyQuestionSelected(safetyQuestionPayload, index));
//       });
//     });
//
//     describe('safetyQuestionOutcomeChanged()', () => {
//       it('should dispatch a new safetyQuestionOutcomeChanged action', () => {
//         const safetyQuestionOutcomePayload: QuestionOutcome = 'P';
//         const index = 1;
//         component.safetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new SafetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index));
//       });
//     });
//
//     describe('balanceQuestionChanged()', () => {
//       it('should dispatch a new BalanceQuestionSelected action', () => {
//         const balanceQuestionPayload: QuestionResult = {
//           code: 'T01',
//           description: 'desc',
//           outcome: 'DF',
//         };
//         const index = 1;
//         component.balanceQuestionChanged(balanceQuestionPayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new BalanceQuestionSelected(balanceQuestionPayload, index));
//       });
//     });
//
//     describe('balanceQuestionOutcomeChanged()', () => {
//       it('should dispatch a new balanceQuestionOutcomeChanged action', () => {
//         const balanceQuestionOutcomePayload: QuestionOutcome = 'P';
//         const index = 1;
//         component.balanceQuestionOutcomeChanged(balanceQuestionOutcomePayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new BalanceQuestionOutcomeChanged(balanceQuestionOutcomePayload, index));
//       });
//     });
//
//     describe('shouldDisplayBanner', () => {
//       it('should return false if there are no riding faults', () => {
//         component.safetyAndBalanceQuestionsScore = {
//           drivingFaults: 0,
//         };
//
//         expect(component.shouldDisplayBanner()).toBeFalsy();
//       });
//
//       it('should return true if there is 1 riding fault', () => {
//         component.safetyAndBalanceQuestionsScore = {
//           drivingFaults: 1,
//         };
//
//         expect(component.shouldDisplayBanner()).toBeTruthy();
//       });
//     });
//   });
// });
