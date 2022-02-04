import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Config, IonicModule, ModalController, NavParams,
} from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { ConfigMock, ModalControllerMock, NavParamsMock } from 'ionic-mocks';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import { QuestionOutcome, QuestionResult } from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';

import { configureTestSuite } from 'ng-bullet';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import {
  SetFullLicenceHeld,
  ShowMeQuestionOutcomeChanged,
  ShowMeQuestionSelected,
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-c/vehicle-checks/vehicle-checks.cat-c.action';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { FaultCountProvider } from '@providers/fault-count/fault-count';
import { VehicleChecksScore } from '@shared/models/vehicle-checks-score.model';
import {
  VehicleChecksQuestionComponent,
} from '@pages/waiting-room-to-car/components/vehicle-checks-question/vehicle-checks-question';
import { VehicleChecksCatCModal } from '../vehicle-checks-modal.cat-c.page';
import { FullLicenceHeldComponent } from '../../../../components/full-licence-held-toggle/full-licence-held-toggle';

describe('VehicleChecksCatCModal', () => {
  let fixture: ComponentFixture<VehicleChecksCatCModal>;
  let component: VehicleChecksCatCModal;
  let store$: Store<StoreModel>;
  let faultCountProvider: FaultCountProvider;

  const bannerDisplayLogicNonTrailer = [
    {
      category: TestCategory.C, drivingFaults: 0, seriousFaults: 0, showBanner: false,
    },
    {
      category: TestCategory.C, drivingFaults: 1, seriousFaults: 0, showBanner: false,
    },
    {
      category: TestCategory.C, drivingFaults: 4, seriousFaults: 1, showBanner: true,
    },
    {
      category: TestCategory.C, drivingFaults: 3, seriousFaults: 0, showBanner: false,
    },
    {
      category: TestCategory.C1, drivingFaults: 0, seriousFaults: 0, showBanner: false,
    },
    {
      category: TestCategory.C1, drivingFaults: 1, seriousFaults: 0, showBanner: false,
    },
    {
      category: TestCategory.C1, drivingFaults: 4, seriousFaults: 1, showBanner: true,
    },
    {
      category: TestCategory.C1, drivingFaults: 3, seriousFaults: 0, showBanner: false,
    },
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatCModal,
        MockComponent(FullLicenceHeldComponent),
        MockComponent(VehicleChecksQuestionComponent),
        WarningBannerComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: ModalController, useFactory: () => ModalControllerMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksCatCModal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    faultCountProvider = TestBed.inject(FaultCountProvider);
    spyOn(store$, 'dispatch');
  }));

  describe('showFullLicenceHeld()', () => {
    [TestCategory.CE, TestCategory.C1E].forEach((category: TestCategory) => {
      it(`should return false for category ${category} and set fullLicenceHeldSelected to Y`, () => {
        component.category = category;
        expect(component.showFullLicenceHeld()).toEqual(true);
      });
    });
    [TestCategory.CE, TestCategory.C1E].forEach((category: TestCategory) => {
      it(`should return true for category ${category}`, () => {
        component.category = category;
        expect(component.showFullLicenceHeld()).toEqual(true);
      });
    });
  });

  describe('Class', () => {
    it('should compile', () => {
      expect(component).toBeDefined();
    });

    describe('showMeQuestionChanged()', () => {
      it('should dispatch a new ShowMeQuestionSelected action', () => {
        const showMeQuestionPayload: QuestionResult = {
          code: '01',
          description: 'desc',
          outcome: 'P',
        };
        const index = 1;
        component.showMeQuestionChanged(showMeQuestionPayload, index);
        expect(component.store$.dispatch).toHaveBeenCalledWith(ShowMeQuestionSelected(showMeQuestionPayload, index));
      });
    });

    describe('showMeQuestionOutcomeChanged()', () => {
      it('should dispatch a new ShowMeQuestionOutcomeChanged action', () => {
        const showMeQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.showMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(ShowMeQuestionOutcomeChanged(showMeQuestionOutcomePayload, index));
      });
    });

    describe('tellMeQuestionChanged()', () => {
      it('should dispatch a new TellMeQuestionSelected action', () => {
        const tellMeQuestionPayload: QuestionResult = {
          code: 'T01',
          description: 'desc',
          outcome: 'DF',
        };
        const index = 1;
        component.tellMeQuestionChanged(tellMeQuestionPayload, index);
        expect(component.store$.dispatch).toHaveBeenCalledWith(TellMeQuestionSelected(tellMeQuestionPayload, index));
      });
    });

    describe('tellMeQuestionOutcomeChanged()', () => {
      it('should dispatch a new TellMeQuestionOutcomeChanged action', () => {
        const tellMeQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.tellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(TellMeQuestionOutcomeChanged(tellMeQuestionOutcomePayload, index));
      });
    });
    describe('shouldDisplayBanner', () => {
      bannerDisplayLogicNonTrailer.forEach((bannerLogic) => {

        it(`Cat ${bannerLogic.category} should return ${bannerLogic.showBanner} if
 there are ${bannerLogic.drivingFaults} driving faults and ${bannerLogic.seriousFaults} serious`, () => {
          component.vehicleChecksScore = {
            drivingFaults: bannerLogic.drivingFaults,
            seriousFaults: bannerLogic.seriousFaults,
          };
          component.category = bannerLogic.category;
          expect(component.shouldDisplayBanner()).toBe(bannerLogic.showBanner);
        });
      });
      [TestCategory.CE, TestCategory.C1E].forEach((category) => {
        it('should show when 1 DF and 1 S for full licence', () => {
          component.vehicleChecksScore = { drivingFaults: 1, seriousFaults: 1 };
          component.category = category;
          component.fullLicenceHeld = true;
          expect(component.shouldDisplayBanner()).toBe(true);
        });
        it('should hide when 1 DF and 1S for non full licence', () => {
          component.vehicleChecksScore = { drivingFaults: 1, seriousFaults: 1 };
          component.category = category;
          component.fullLicenceHeld = false;
          expect(component.shouldDisplayBanner()).toBe(false);
        });
        it('should hide when 4 DF and 0S for non full licence', () => {
          component.vehicleChecksScore = { drivingFaults: 4, seriousFaults: 0 };
          component.category = category;
          component.fullLicenceHeld = false;
          expect(component.shouldDisplayBanner()).toBe(false);
        });
      });

      describe('fullLicenceHeldChange()', () => {
        it('should convert input to a boolean and pass into setNumberOfShowMeTellMeQuestions', () => {
          spyOn(component, 'setNumberOfShowMeTellMeQuestions');
          spyOn(faultCountProvider, 'getVehicleChecksFaultCount').and.returnValue({} as VehicleChecksScore);
          component.category = TestCategory.C1E;
          component.vehicleChecks = {};
          component.fullLicenceHeldChange(true);
          expect(store$.dispatch).toHaveBeenCalledWith(SetFullLicenceHeld(true));
          expect(component.setNumberOfShowMeTellMeQuestions).toHaveBeenCalledWith(true);
          expect(faultCountProvider.getVehicleChecksFaultCount).toHaveBeenCalledWith(TestCategory.C1E, {});
        });
      });
    });
  });
});
