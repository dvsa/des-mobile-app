import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReverseDiagramPage } from '../reverse-diagram-modal';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '../../../../../app/app.module';
import { Config, IonicModule, NavController, NavParams, Platform } from 'ionic-angular';
import { ConfigMock, NavControllerMock, NavParamsMock, PlatformMock } from 'ionic-mocks';
import { ReversingDistancesProvider } from '../../../../../providers/reversing-distances/reversing-distances';
import { MockAppComponent } from '../../../../../app/__mocks__/app.component.mock';
import { App } from '../../../../../app/app.component';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ReverseDiagramModalMock, VehicleData } from '../__mocks__/reverse-diagram-modal.mock';
import { NavigationProvider } from '../../../../../providers/navigation/navigation';
import { NavigationProviderMock } from '../../../../../providers/navigation/__mocks__/navigation.mock';
import { NavigationStateProvider } from '../../../../../providers/navigation-state/navigation-state';
import { NavigationStateProviderMock } from '../../../../../providers/navigation-state/__mocks__/navigation-state.mock';
import { Store, StoreModule } from '@ngrx/store';
import { StoreModel } from '../../../../../shared/models/store.model';
import { ReverseDiagramLengthChanged, ReverseDiagramWidthChanged } from '../reverse-diagram-modal.actions';

describe('reverseDiagramModal', () => {
  let fixture: ComponentFixture<ReverseDiagramPage>;
  let component: ReverseDiagramPage;
  let store$: Store<StoreModel>;
  const mockFile: ReverseDiagramModalMock = new ReverseDiagramModalMock();
  mockFile.ngOnInit();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ReverseDiagramPage],
      imports: [
        AppModule,
        IonicModule,
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                category: TestCategory.D, // Value will be overridden where necessary
                vehicleDetails: {
                  vehicleLength: 10,
                  vehicleWidth: 2.75,
                },
                accompaniment: {},
                testData: {
                  dangerousFaults: {},
                  drivingFaults: {},
                  manoeuvres: {},
                  seriousFaults: {},
                  testRequirements: {},
                  ETA: {},
                  eco: {},
                  vehicleChecks: {
                    showMeQuestions: [{
                      code: 'S3',
                      description: '',
                      outcome: '',
                    }],
                    tellMeQuestions: [{
                      code: '',
                      description: '',
                      outcome: '',
                    }],
                  },
                  eyesightTest: {},
                },
                activityCode: '28',
                journalData: {
                  candidate: {
                    candidateName: 'Joe Bloggs',
                    driverNumber: '123',
                  },
                },
                rekey: false,
              },
            },
          }),
        }),
      ],
      providers: [
        { provide: Config, useFactory: () => ConfigMock.instance() },
        { provide: Platform, useFactory: () => PlatformMock.instance() },
        { provide: NavParams, useFactory: () => NavParamsMock.instance() },
        { provide: NavController, useFactory: () => NavControllerMock.instance() },
        { provide: App, useClass: MockAppComponent },
        { provide: NavigationProvider, useClass: NavigationProviderMock },
        { provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
        ReversingDistancesProvider,
      ],
    });
  });
  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReverseDiagramPage);
    component = fixture.componentInstance;
    store$ = TestBed.get(Store);
    spyOn(store$, 'dispatch');
  }));
  describe('Class', () => {
    const vehicleDetails: Map<TestCategory, VehicleData> = mockFile.getVehicleDetails();
    const vehicleDetailsKeys = Array.from(vehicleDetails.keys());
    for (const index in vehicleDetailsKeys) {
      const testCategory = vehicleDetailsKeys[index];
      const value = vehicleDetails.get(testCategory);
      const cappedStartDistanceCategories = mockFile.getCappedStartDistanceCategories();
      describe(`Category ${testCategory}`, () => {
        describe(`ngOnInit`, () => {
          it('should set the distance based on booked in vehicle length', (done: DoneFn) => {
            component.category = testCategory;
            component.ngOnInit();
            component.componentState.vehicleLength$.subscribe((result) => {
              expect(result).toEqual(value.vLength);
              done();
            });
          });
          it('should set the distance based on booked in vehicle width', (done: DoneFn) => {
            component.category = testCategory;
            component.ngOnInit();
            component.componentState.vehicleWidth$.subscribe((result) => {
              expect(result).toEqual(mockFile.vehicleDetails.get(component.category).vWidth);
              done();
            });
          });
        });
        describe('calculateReversingLengths', () => {
          it(`should resolve aAndA1 to ${value.expStartDist}`, () => {
            spyOn(component, 'calculateReversingLengths').and.callThrough();
            component.category = testCategory;
            component.onLengthKeyup(value.vLength);
            expect(store$.dispatch).toHaveBeenCalledWith(
              new ReverseDiagramLengthChanged(undefined, value.vLength),
            );
            expect(component.calculateReversingLengths).toHaveBeenCalledWith(value.vLength);
            const result = component.reversingLengthStart;
            expect(result).toEqual(value.expStartDist);
          });
          if (cappedStartDistanceCategories.includes(testCategory)) {
            it('should override startDistance if vehicleLength > 16.5', () => {
              component.category = testCategory;
              component.calculateReversingLengths(17);
              const result = component.reversingLengthStart;
              expect(result).toEqual(66);
            });
          }
          it(`should resolve b to ${value.expMidDist}`, () => {
            spyOn(component, 'calculateReversingLengths').and.callThrough();
            component.category = testCategory;
            component.onLengthKeyup(value.vLength);
            expect(store$.dispatch).toHaveBeenCalledWith(
              new ReverseDiagramLengthChanged(undefined, value.vLength),
            );
            expect(component.calculateReversingLengths).toHaveBeenCalledWith(value.vLength);
            const result = component.reversingLengthMiddle;
            expect(result).toEqual(value.expMidDist);
          });
        });
        describe('calculateReversingWidth', () => {
          it(`should resolve aToA1 to ${value.expWidthDist}`, () => {
            component.category = testCategory;
            spyOn(component, 'calculateReversingWidth').and.callThrough();
            component.category = testCategory;
            component.onWidthKeyup(value.vWidth);
            expect(store$.dispatch).toHaveBeenCalledWith(
              new ReverseDiagramWidthChanged(undefined, value.vWidth),
            );
            expect(component.calculateReversingWidth).toHaveBeenCalledWith(value.vWidth);
            const result = component.reversingWidth;
            expect(result).toEqual(value.expWidthDist);
          });
        });
        describe('calculateAtoBMultiplierText', () => {
          it(`should return the A to B multiplier text of ${value.expMidDistMultiplier}`, () => {
            component.category = testCategory;
            component.calculateAtoBMultiplierText();
            const result = component.multiplierText;
            expect(result).toEqual(value.expMidDistMultiplier);
          });
        });
      });
    }

    describe('ionViewWillEnter', () => {
      it('should calculate the distances if vehicle dimensions are populated', () => {
        const calculateDistanceLengthSpy = spyOn(component, 'calculateReversingLengths');
        const calculateDistanceWidthSpy = spyOn(component, 'calculateReversingWidth');
        const calculateAtoBMultiplierTextSpy = spyOn(component, 'calculateAtoBMultiplierText');
        component.ngOnInit();
        const result = component.ionViewWillEnter();
        expect(calculateDistanceLengthSpy).toHaveBeenCalled();
        expect(calculateDistanceWidthSpy).toHaveBeenCalled();
        expect(calculateAtoBMultiplierTextSpy).toHaveBeenCalled();
        expect(result).toEqual(true);
      });
    });

    describe('getReversingDiagramLabel', () => {
      it('should return `articulated` when the category is one of BE, CE, C1E, DE, D1E', () => {
        const categories = [TestCategory.BE, TestCategory.CE, TestCategory.C1E, TestCategory.DE, TestCategory.D1E];
        categories.forEach((category: TestCategory) => {
          component.category = category;
          expect(component.getReversingDiagramLabel()).toEqual('articulated');
        });
      });

      it('should return `rigid` when the category is one of C, C1, D, D1', () => {
        const categories = [TestCategory.C, TestCategory.C1, TestCategory.D, TestCategory.D1];
        categories.forEach((category: TestCategory) => {
          component.category = category;
          expect(component.getReversingDiagramLabel()).toEqual('rigid');
        });
      });
    });
  });
});
