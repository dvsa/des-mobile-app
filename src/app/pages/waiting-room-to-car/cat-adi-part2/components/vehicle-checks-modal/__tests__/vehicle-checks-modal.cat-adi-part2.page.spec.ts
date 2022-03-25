import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, Config, NavController } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { ConfigMock, NavControllerMock } from 'ionic-mocks';
import { AppModule } from '@app/app.module';
import { MockComponent } from 'ng-mocks';
import {
  QuestionOutcome,
  QuestionResult,
} from '@dvsa/mes-test-schema/categories/common';
import { StoreModel } from '@shared/models/store.model';
import {
  TellMeQuestionSelected,
  TellMeQuestionOutcomeChanged,
} from '@store/tests/test-data/cat-adi-part2/vehicle-checks/vehicle-checks.cat-adi-part2.action';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { configureTestSuite } from 'ng-bullet';
import {
  VehicleChecksQuestionComponent,
} from '@pages/waiting-room-to-car/components/vehicle-checks-question/vehicle-checks-question';
import { VehicleChecksCatADIPart2Modal } from '../vehicle-checks-modal.cat-adi-part2.page';

describe('VehicleChecksCatADIPart2Modal', () => {
  let fixture: ComponentFixture<VehicleChecksCatADIPart2Modal>;
  let component: VehicleChecksCatADIPart2Modal;
  let store$: Store<StoreModel>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        VehicleChecksCatADIPart2Modal,
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
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(VehicleChecksCatADIPart2Modal);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    it('should compile', () => {
      expect(component).toBeDefined();
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
  });
});
