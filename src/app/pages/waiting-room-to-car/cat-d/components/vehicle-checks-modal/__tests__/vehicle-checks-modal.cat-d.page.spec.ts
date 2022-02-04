// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { Config, IonicModule, NavParams, ViewController } from 'ionic-angular';
// import { VehicleChecksCatDModal } from '../vehicle-checks-modal.cat-d.page';
// import { Store, StoreModule } from '@ngrx/store';
// import { ConfigMock, NavParamsMock, ViewControllerMock } from 'ionic-mocks';
// import { AppModule } from '../../../../../../app/app.module';
// import { MockComponent } from 'ng-mocks';
// import { VehicleChecksQuestionCatDComponent } from '../../vehicle-checks-question/vehicle-checks-question.cat-d';
// import { SafetyQuestionComponent } from '../../safety-question/safety-question';
// import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
// import { StoreModel } from '../../../../../../shared/models/store.model';
//
// import {
//   SetFullLicenceHeld,
//   ShowMeQuestionOutcomeChanged,
//   ShowMeQuestionSelected,
//   TellMeQuestionOutcomeChanged,
//   TellMeQuestionSelected,
// } from '../../../../../../modules/tests/test-data/cat-d/vehicle-checks/vehicle-checks.cat-d.action';
// import {
//   SafetyQuestionOutcomeChanged,
// } from '../../../../../../modules/tests/test-data/cat-d/safety-questions/safety-questions.cat-d.action';
// import { WarningBannerComponent } from '../../../../../../components/common/warning-banner/warning-banner';
// import { configureTestSuite } from 'ng-bullet';
// import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
// import { FullLicenceHeldComponent } from '../../../../components/full-licence-held-toggle/full-licence-held-toggle';
// import { FaultCountProvider } from '../../../../../../providers/fault-count/fault-count';
// import { VehicleChecksScore } from '../../../../../../shared/models/vehicle-checks-score.model';
//
// describe('VehicleChecksCatDModal', () => {
//   let fixture: ComponentFixture<VehicleChecksCatDModal>;
//   let component: VehicleChecksCatDModal;
//   let store$: Store<StoreModel>;
//   let faultCountProvider: FaultCountProvider;
//
//   const bannerDisplayLogicNonTrailer = [
//     { category: TestCategory.D, drivingFaults: 0, seriousFaults: 0, showBanner: false },
//     { category: TestCategory.D, drivingFaults: 1, seriousFaults: 0, showBanner: false },
//     { category: TestCategory.D, drivingFaults: 4, seriousFaults: 1, showBanner: true },
//     { category: TestCategory.D, drivingFaults: 3, seriousFaults: 0, showBanner: false },
//     { category: TestCategory.D1, drivingFaults: 0, seriousFaults: 0, showBanner: false },
//     { category: TestCategory.D1, drivingFaults: 1, seriousFaults: 0, showBanner: false },
//     { category: TestCategory.D1, drivingFaults: 4, seriousFaults: 1, showBanner: true },
//     { category: TestCategory.D1, drivingFaults: 3, seriousFaults: 0, showBanner: false },
//   ];
//
//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       declarations: [
//         VehicleChecksCatDModal,
//         MockComponent(FullLicenceHeldComponent),
//         MockComponent(VehicleChecksQuestionCatDComponent),
//         MockComponent(SafetyQuestionComponent),
//         WarningBannerComponent,
//       ],
//       imports: [
//         IonicModule,
//         AppModule,
//         StoreModule.forRoot({}),
//       ],
//       providers: [
//         { provide: Config, useFactory: () => ConfigMock.instance() },
//         { provide: ViewController, useFactory: () => ViewControllerMock.instance() },
//         { provide: NavParams, useFactory: () => NavParamsMock.instance() },
//       ],
//     });
//   });
//
//   beforeEach(async(() => {
//     fixture = TestBed.createComponent(VehicleChecksCatDModal);
//     component = fixture.componentInstance;
//     store$ = TestBed.get(Store);
//     faultCountProvider = TestBed.get(FaultCountProvider);
//     spyOn(store$, 'dispatch');
//   }));
//
//   describe('Class', () => {
//     it('should compile', () => {
//       expect(component).toBeDefined();
//     });
//
//     describe('showMeQuestionChanged()', () => {
//       it('should dispatch a new ShowMeQuestionSelected action', () => {
//         const showMeQuestionPayload: QuestionResult = {
//           code: '01',
//           description: 'desc',
//           outcome: 'P',
//         };
//         const index = 1;
//         component.showMeQuestionChanged(showMeQuestionPayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new ShowMeQuestionSelected(showMeQuestionPayload, index));
//       });
//     });
//
//     describe('showMeQuestionOutcomeChanged()', () => {
//       it('should dispatch a new ShowMeQuestionOutcomeChanged action', () => {
//         const showMeQuestionOutcomePayload: QuestionOutcome = 'P';
//         const index = 1;
//         component.showMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new ShowMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index));
//       });
//     });
//
//     describe('tellMeQuestionChanged()', () => {
//       it('should dispatch a new TellMeQuestionSelected action', () => {
//         const tellMeQuestionPayload: QuestionResult = {
//           code: 'T01',
//           description: 'desc',
//           outcome: 'DF',
//         };
//         const index = 1;
//         component.tellMeQuestionChanged(tellMeQuestionPayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new TellMeQuestionSelected(tellMeQuestionPayload, index));
//       });
//     });
//
//     describe('tellMeQuestionOutcomeChanged()', () => {
//       it('should dispatch a new TellMeQuestionOutcomeChanged action', () => {
//         const tellMeQuestionOutcomePayload: QuestionOutcome = 'P';
//         const index = 1;
//         component.tellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new TellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index));
//       });
//     });
//
//     describe('safetyQuestionOutcomeChanged()', () => {
//       it('should dispatch a new SafetyQuestionOutcomeChanged action', () => {
//         const safetyQuestionOutcomePayload: QuestionOutcome = 'P';
//         const index = 1;
//         component.safetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index);
//         expect(component.store$.dispatch)
//           .toHaveBeenCalledWith(new SafetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index));
//       });
//     });
//
//     describe('shouldDisplayBanner', () => {
//       bannerDisplayLogicNonTrailer.forEach((bannerLogic) => {
//         it(`Cat ${bannerLogic.category} should return ${bannerLogic.showBanner} if there are
//  ${bannerLogic.drivingFaults} driving faults and ${bannerLogic.seriousFaults} serious`, () => {
//           component.vehicleChecksScore = {
//             drivingFaults: bannerLogic.drivingFaults,
//             seriousFaults: bannerLogic.seriousFaults,
//           };
//           component.fullLicenceHeldSelected = 'Y';
//           component.category = bannerLogic.category;
//           expect(component.shouldDisplayBanner()).toBe(bannerLogic.showBanner);
//         });
//       });
//
//       [TestCategory.DE, TestCategory.D1E].forEach((category) => {
//         it('should show when 1 DF and 1 S for full licence', () => {
//           component.vehicleChecksScore = { drivingFaults: 1, seriousFaults: 1 };
//           component.category = category;
//           component.fullLicenceHeld = true;
//           expect(component.shouldDisplayBanner()).toBe(true);
//         });
//         it('should hide when 1 DF and 1S for non full licence', () => {
//           component.vehicleChecksScore = { drivingFaults: 1, seriousFaults: 1 };
//           component.category = category;
//           component.fullLicenceHeld = false;
//           expect(component.shouldDisplayBanner()).toBe(false);
//         });
//         it('should hide when 4 DF and 0S for non full licence', () => {
//           component.vehicleChecksScore = { drivingFaults: 4, seriousFaults: 0 };
//           component.category = category;
//           component.fullLicenceHeld = false;
//           expect(component.shouldDisplayBanner()).toBe(false);
//         });
//       });
//     });
//
//     describe('fullLicenceHeldChange()', () => {
//       it('should convert input to a boolean and pass into setNumberOfShowMeTellMeQuestions', () => {
//         spyOn(component, 'setNumberOfShowMeTellMeQuestions');
//         spyOn(faultCountProvider, 'getVehicleChecksFaultCount').and.returnValue({} as VehicleChecksScore);
//         component.category = TestCategory.D1E;
//         component.vehicleChecks = {};
//         component.fullLicenceHeldChange(true);
//         expect(store$.dispatch).toHaveBeenCalledWith(new SetFullLicenceHeld(true));
//         expect(component.setNumberOfShowMeTellMeQuestions).toHaveBeenCalledWith(true);
//         expect(faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalledWith(TestCategory.D1E, {});
//       });
//     });
//
//     describe('showFullLicenceHeld()', () => {
//       [TestCategory.D, TestCategory.D1].forEach((category: TestCategory) => {
//         it(`should return false for category ${category} and set fullLicenceHeldSelected to Y`, () => {
//           component.category = category;
//           expect(component.showFullLicenceHeld()).toEqual(false);
//         });
//       });
//       [TestCategory.DE, TestCategory.D1E].forEach((category: TestCategory) => {
//         it(`should return true for category ${category}`, () => {
//           component.category = category;
//           expect(component.showFullLicenceHeld()).toEqual(true);
//         });
//       });
//     });
//   });
//
//   describe('DOM', () => {
//
//   });
// });
