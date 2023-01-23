import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  IonicModule,
  NavController,
  Platform,
  ToastController,
  ModalController,
} from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { Store, StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ComponentsModule } from '@components/common/common-components.module';
import { AppModule } from 'src/app/app.module';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { StoreModel } from '@shared/models/store.model';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import {
  OutcomeBehaviourMapProviderMock,
}
  from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { PipesModule } from '@shared/pipes/pipes.module';
import { DeviceProvider } from '@providers/device/device';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { OfficeCatADI3Page } from '@pages/office/cat-adi-part3/office.cat-adi-part3.page';
import { TestResultCatADI3Schema } from '@dvsa/mes-test-schema/categories/ADI3';
import { TestResultProvider } from '@providers/test-result/test-result';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';
import { CandidateSectionComponent } from '@pages/office/components/candidate-section/candidate-section';
import {
  AdditionalInformationComponent,
}
  from '@pages/office/components/additional-information/additional-information';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { FaultSummaryProviderMock } from '@providers/fault-summary/__mocks__/fault-summary.mock';
import { BasePageComponent } from '@shared/classes/base-page';

describe('OfficeCatADI3Page', () => {
  let fixture: ComponentFixture<OfficeCatADI3Page>;
  let component: OfficeCatADI3Page;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatADI3Page,
        MockComponent(AdditionalInformationComponent),
        MockComponent(CandidateSectionComponent),
      ],
      imports: [
        PipesModule,
        IonicModule,
        AppModule,
        ComponentsModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                category: TestCategory.ADI3,
                accompaniment: {},
                testData: {},
                activityCode: '28',
                journalData: {
                  candidate: {
                    candidateName: {},
                    driverNumber: '123',
                  },
                },
                rekey: false,
              } as TestResultCatADI3Schema,
            },
          }),
        }),
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: AuthenticationProvider, useClass: AuthenticationProviderMock },
        { provide: NavController, useClass: NavControllerMock },
        { provide: ToastController, useClass: ToastControllerMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: FaultSummaryProvider, useClass: FaultSummaryProviderMock },
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProviderMock },
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: TestResultProvider, useClass: TestResultProviderMock },
      ],
    });

    fixture = TestBed.createComponent(OfficeCatADI3Page);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    spyOn(store$, 'dispatch');
    spyOn(component.deviceProvider, 'disableSingleAppMode');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ionViewWillEnter', () => {
    it('should disable single app mode if it not in practice mode and isIos is true', async () => {
      component.isPracticeMode = false;
      spyOn(BasePageComponent.prototype, 'isIos').and.returnValue(true);
      spyOn(BasePageComponent.prototype, 'ionViewWillEnter');
      spyOn(component.deviceProvider, 'disableSingleAppMode');
      await component.ionViewWillEnter();
      expect(component.deviceProvider.disableSingleAppMode).toHaveBeenCalled();
    });
  });
});
