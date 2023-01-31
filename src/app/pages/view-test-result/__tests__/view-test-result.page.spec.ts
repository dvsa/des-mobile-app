import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { ViewTestResultPage } from '@pages/view-test-result/view-test-result.page';
import { Store, StoreModule } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CompressionProvider } from '@providers/compression/compression';
import { CompressionProviderMock } from '@providers/compression/__mocks__/compression.mock';
import { FaultSummaryProvider } from '@providers/fault-summary/fault-summary';
import { StoreModel } from '@shared/models/store.model';
import { ViewTestResultViewDidEnter } from '@pages/view-test-result/view-test-result.actions';
import { SearchProvider } from '@providers/search/search';
import { SearchProviderMock } from '@providers/search/__mocks__/search.mock';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';

xdescribe('ViewTestResultPage', () => {
  let fixture: ComponentFixture<ViewTestResultPage>;
  let component: ViewTestResultPage;
  let store$: Store<StoreModel>;
  let searchProvider: SearchProvider;
  let compressionProvider: CompressionProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ViewTestResultPage,
      ],
      imports: [
        IonicModule,
        AppModule,
        StoreModule.forRoot({
          appInfo: () => ({
            versionNumber: '5',
          }),
        })],
      providers: [
        { provide: CompressionProvider, useClass: CompressionProviderMock },
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: FaultSummaryProvider, useClass: FaultSummaryProvider },
        { provide: SearchProvider, useClass: SearchProviderMock },
      ],
    });

    fixture = TestBed.createComponent(ViewTestResultPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    searchProvider = TestBed.inject(SearchProvider);
    compressionProvider = TestBed.inject(CompressionProvider);

    spyOn(searchProvider, 'getTestResult').and.returnValue(of(new HttpResponse({
      body: '',
    }) as any));
    spyOn(compressionProvider, 'extractTestResult').and.returnValue({
      changeMarker: false,
      examinerBooked: undefined,
      examinerConducted: undefined,
      examinerKeyed: 0,
      version: '',
      category: TestCategory.EUAM1,
      vehicleDetails: {},
      accompaniment: {},
      testData: {
        dangerousFaults: {
          controlsAccelerator: true,
          controlsClutch: true,
          controlsGears: true,
        },
        drivingFaults: {
          controlsAccelerator: 2,
          controlsClutch: 2,
          controlsGears: 6,
          controlsFootbrake: 10,
        },
        manoeuvres: {},
        seriousFaults: {
          controlsAccelerator: true,
          controlsClutch: true,
        },
        testRequirements: {},
        ETA: {},
        eco: {},
      },
      activityCode: '28',
      journalData: {
        candidate: {
          candidateName: { firstName: 'Joe', secondName: 'Williams' },
          driverNumber: '123',
        },
        examiner: { staffNumber: '1111' },
        testCentre: {
          costCode: 'AAA',
          centreId: 1,
        },
        testSlotAttributes: {
          slotId: 1,
          start: '11:11:11',
          vehicleTypeCode: 'Car',
          welshTest: false,
          specialNeeds: false,
          extendedTest: false,
        },
        applicationReference: {
          applicationId: 1,
          bookingSequence: 2,
          checkDigit: 3,
        },
      },
      rekey: false,
    } as TestResultSchemasUnion);
  }));

  describe('getDrivingFaultSumCount', () => {
    it('should return the correct number of listed driving faults', () => {
      component.testCategory = TestCategory.B;
      expect(component.getDrivingFaultSumCount()).toEqual(20);
    });
  });

  describe('getDangerousFaults', () => {
    it('should return the correct number of listed driving faults', () => {
      component.ngOnInit();
      component.testCategory = TestCategory.B;
      expect(component.getDangerousFaults()).toEqual([]);
    });
  });

  describe('onClose', () => {
    it('should dismiss modalCtrl', async () => {
      spyOn(component.modalCtrl, 'dismiss');
      await component.onClose();
      expect(component.modalCtrl.dismiss()).toHaveBeenCalled();
    });
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch the ViewTestResultViewDidEnter action', () => {
      spyOn(store$, 'dispatch');

      component.ionViewDidEnter();
      expect(store$.dispatch).toHaveBeenCalledWith(ViewTestResultViewDidEnter(component.applicationReference));
    });
  });

  // describe('didTestTerminate', () => {
  //   it('should return true if the activityCode is not set to a fail value or the pass value', () => {
  //     component.ngOnInit();
  //     component.testResult.activityCode = '41';
  //     expect(component.didTestTerminate()).toEqual(true);
  //   });
  //   it('should return true if the activityCode is set to a fail value', () => {
  //     component.ngOnInit();
  //     component.testResult.activityCode = '2';
  //     expect(component.didTestTerminate()).toEqual(false);
  //   });
  //   it('should return false if the activityCode is set to the pass value', () => {
  //     component.ngOnInit();
  //     component.testResult.activityCode = '1';
  //     expect(component.didTestTerminate()).toEqual(false);
  //   });
  // });
});
