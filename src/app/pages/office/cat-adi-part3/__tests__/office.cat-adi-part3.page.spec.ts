import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestResultCatADI3Schema } from '@dvsa/mes-test-schema/categories/ADI3';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { ModalControllerMock, PlatformMock } from '@mocks/index.mock';
import { Store, StoreModule } from '@ngrx/store';
import { OfficeCatADI3Page } from '@pages/office/cat-adi-part3/office.cat-adi-part3.page';
import { AdditionalInformationComponent } from '@pages/office/components/additional-information/additional-information';
import { CandidateSectionComponent } from '@pages/office/components/candidate-section/candidate-section';
import { OfficeFooterComponent } from '@pages/office/components/office-footer/office-footer.component';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { FaultSummaryProviderMock } from '@providers/fault-summary/__mocks__/fault-summary.mock';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { OutcomeBehaviourMapProviderMock } from '@providers/outcome-behaviour-map/__mocks__/outcome-behaviour-map.mock';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TestResultProviderMock } from '@providers/test-result/__mocks__/test-result.mock';
import { TestResultProvider } from '@providers/test-result/test-result';
import { BasePageComponent } from '@shared/classes/base-page';
import { NavControllerMock } from '@shared/mocks/nav-controller.mock';
import { ToastControllerMock } from '@shared/mocks/toast-controller.mock';
import { StoreModel } from '@shared/models/store.model';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MockComponent } from 'ng-mocks';
import { AppModule } from 'src/app/app.module';

describe('OfficeCatADI3Page', () => {
  let fixture: ComponentFixture<OfficeCatADI3Page>;
  let component: OfficeCatADI3Page;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        OfficeCatADI3Page,
        MockComponent(OfficeFooterComponent),
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
                category: TestCategory.SC,
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

  describe('ngOnInit', () => {
    it('should resolve state variables', () => {
      component.ngOnInit();
      component.pageState.isStandardsCheck$.subscribe((val) => {
        expect(val).toEqual(true);
      });
    });
  });
});
