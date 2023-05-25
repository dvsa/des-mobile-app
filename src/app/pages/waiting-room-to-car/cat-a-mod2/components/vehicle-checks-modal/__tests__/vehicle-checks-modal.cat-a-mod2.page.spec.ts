import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule, ModalController, NavParams,
} from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { ModalControllerMock, NavParamsMock } from '@mocks/index.mock';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import {
  QuestionOutcome,
  QuestionResult,
} from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import {
  SafetyQuestionOutcomeChanged,
  BalanceQuestionSelected,
  SafetyQuestionSelected,
  BalanceQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-a-mod2/safety-and-balance/safety-and-balance.cat-a-mod2.actions';
import {
  VehicleChecksQuestionCatAMod2Component,
} from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-question/vehicle-checks-question';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '@components/common/header-component/header.component';
import * as vehicleChecksModalActions from '../vehicle-checks-modal.cat-a-mod2.actions';
import { VehicleChecksCatAMod2Modal } from '../vehicle-checks-modal.cat-a-mod2.page';

describe('VehicleChecksCatAMod2Modal', () => {
  let fixture: ComponentFixture<VehicleChecksCatAMod2Modal>;
  let component: VehicleChecksCatAMod2Modal;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatAMod2Modal,
        MockComponent(VehicleChecksQuestionCatAMod2Component),
        MockComponent(HeaderComponent),
        WarningBannerComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: NavParams, useClass: NavParamsMock },
      ],
    });

    fixture = TestBed.createComponent(VehicleChecksCatAMod2Modal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should compile', () => {
      expect(component)
        .toBeDefined();
    });

    describe('ionViewDidLeave', () => {
      it('should unsubscribe from the subscription if there is one', () => {
        component.subscription = new Subscription();
        spyOn(component.subscription, 'unsubscribe');
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe)
          .toHaveBeenCalled();
      });
    });

    describe('safetyQuestionChanged', () => {
      it('should dispatch a new ShowMeQuestionSelected action', () => {
        const safetyQuestionPayload: QuestionResult = {
          code: '01',
          description: 'desc',
          outcome: 'P',
        };
        const index = 1;
        component.safetyQuestionChanged(safetyQuestionPayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(SafetyQuestionSelected(safetyQuestionPayload, index));
      });
    });

    describe('safetyQuestionOutcomeChanged', () => {
      it('should dispatch a new safetyQuestionOutcomeChanged action', () => {
        const safetyQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.safetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(SafetyQuestionOutcomeChanged(safetyQuestionOutcomePayload, index));
      });
    });

    describe('balanceQuestionChanged', () => {
      it('should dispatch a new BalanceQuestionSelected action', () => {
        const balanceQuestionPayload: QuestionResult = {
          code: 'T01',
          description: 'desc',
          outcome: 'DF',
        };
        const index = 1;
        component.balanceQuestionChanged(balanceQuestionPayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(BalanceQuestionSelected(balanceQuestionPayload, index));
      });
    });

    describe('balanceQuestionOutcomeChanged', () => {
      it('should dispatch a new balanceQuestionOutcomeChanged action', () => {
        const balanceQuestionOutcomePayload: QuestionOutcome = 'P';
        const index = 1;
        component.balanceQuestionOutcomeChanged(balanceQuestionOutcomePayload, index);
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(BalanceQuestionOutcomeChanged(balanceQuestionOutcomePayload, index));
      });
    });

    describe('ionViewDidEnter', () => {
      it('should dispatch the store with VehicleChecksViewDidEnter', () => {
        spyOn(component.store$, 'dispatch');
        component.ionViewDidEnter();
        expect(component.store$.dispatch)
          .toHaveBeenCalledWith(vehicleChecksModalActions.VehicleChecksViewDidEnter());
      });
    });

    describe('onClose', () => {
      it('should dismiss the modal card', async () => {
        spyOn(component.modalCtrl, 'dismiss');
        await component.onClose();
        expect(component.modalCtrl.dismiss)
          .toHaveBeenCalled();
      });
    });

    describe('onSubmit', () => {
      it('should dismiss the modal card', async () => {
        spyOn(component.modalCtrl, 'dismiss');
        await component.onSubmit();
        expect(component.modalCtrl.dismiss)
          .toHaveBeenCalled();
      });
    });

    describe('shouldDisplayBanner', () => {
      it('should return false if there are no riding faults', () => {
        component.safetyAndBalanceQuestionsScore = {
          drivingFaults: 0,
        };

        expect(component.shouldDisplayBanner())
          .toBeFalsy();
      });

      it('should return true if there is 1 riding fault', () => {
        component.safetyAndBalanceQuestionsScore = {
          drivingFaults: 1,
        };

        expect(component.shouldDisplayBanner())
          .toBeTruthy();
      });
    });
  });
});
