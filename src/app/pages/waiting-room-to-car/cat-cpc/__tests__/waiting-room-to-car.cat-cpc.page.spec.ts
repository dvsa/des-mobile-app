import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppModule } from '@app/app.module';
import { EndTestLinkComponent } from '@components/common/end-test-link/end-test-link';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { Question, Question5, TestResultCatCPCSchema } from '@dvsa/mes-test-schema/categories/CPC';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Platform } from '@ionic/angular';
import { PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { AccompanimentCardCatCPCComponent } from '@pages/waiting-room-to-car/cat-cpc/components/accompaniment-card/accompaniment-card.cat-cpc';
import { CombinationComponent } from '@pages/waiting-room-to-car/cat-cpc/components/combination/combination';
import { VehicleDetailsCatCPCComponent } from '@pages/waiting-room-to-car/cat-cpc/components/vehicle-details/vehicle-details';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { CandidateDeclarationSignedComponent } from '@pages/waiting-room-to-car/components/candidate-declaration/candidate-declaration';
import { VehicleDetailsComponent } from '@pages/waiting-room-to-car/components/vehicle-details/vehicle-details';
import { VehicleRegistrationComponent } from '@pages/waiting-room-to-car/components/vehicle-registration/vehicle-registration';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { CpcQuestionsMock } from '@providers/cpc-questions/__mocks__/cpc-questions.mock';
import { CPCQuestionProvider } from '@providers/cpc-questions/cpc-questions';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { WaitingRoomToCarBasePageComponent } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { StoreModel } from '@shared/models/store.model';
import { AppInfoStateModel } from '@store/app-info/app-info.model';
import { PopulateCombination } from '@store/tests/test-data/cat-cpc/combination/combination.action';
import { PopulateQuestions } from '@store/tests/test-data/cat-cpc/questions/questions.action';
import { TestsModel } from '@store/tests/tests.model';
import { PopulateVehicleConfiguration } from '@store/tests/vehicle-details/vehicle-details.actions';
import { MockComponent } from 'ng-mocks';
import { Subscription } from 'rxjs';
import { WaitingRoomToCarCatCPCPage } from '../waiting-room-to-car.cat-cpc.page';

describe('WaitingRoomToCarCatCPCPage', () => {
	let component: WaitingRoomToCarCatCPCPage;
	let fixture: ComponentFixture<WaitingRoomToCarCatCPCPage>;
	let store$: Store<StoreModel>;
	let routeByCategoryProvider: RouteByCategoryProvider;
	let cpcQuestionProvider: CPCQuestionProvider;

	const initialState = {
		appInfo: { versionNumber: '4.0' } as AppInfoStateModel,
		tests: {
			currentTest: { slotId: '123' },
			testStatus: {},
			startedTests: {
				123: {
					vehicleDetails: {},
					accompaniment: {},
					category: TestCategory.CCPC,
					testData: {},
					journalData: {
						candidate: {
							candidateName: {
								firstName: 'Joe',
								lastName: 'Bloggs',
							},
						},
					},
				} as TestResultCatCPCSchema,
			},
		} as TestsModel,
	} as StoreModel;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			declarations: [
				WaitingRoomToCarCatCPCPage,
				MockComponent(EndTestLinkComponent),
				MockComponent(VehicleRegistrationComponent),
				MockComponent(VehicleDetailsCatCPCComponent),
				MockComponent(VehicleDetailsComponent),
				MockComponent(AccompanimentCardCatCPCComponent),
				MockComponent(AccompanimentComponent),
				MockComponent(WarningBannerComponent),
				MockComponent(CandidateDeclarationSignedComponent),
				MockComponent(CombinationComponent),
			],
			imports: [AppModule, ReactiveFormsModule],
			providers: [
				{
					provide: RouteByCategoryProvider,
					useClass: RouteByCategoryProviderMock,
				},
				{
					provide: AuthenticationProvider,
					useClass: AuthenticationProviderMock,
				},
				{
					provide: Platform,
					useClass: PlatformMock,
				},
				{
					provide: Router,
					useClass: RouterMock,
				},
				{
					provide: DateTimeProvider,
					useClass: DateTimeProviderMock,
				},
				{
					provide: CPCQuestionProvider,
					useClass: CpcQuestionsMock,
				},
				provideMockStore({ initialState }),
			],
		});

		fixture = TestBed.createComponent(WaitingRoomToCarCatCPCPage);
		component = fixture.componentInstance;
		fixture.detectChanges();

		store$ = TestBed.inject(Store);
		routeByCategoryProvider = TestBed.inject(RouteByCategoryProvider);
		cpcQuestionProvider = TestBed.inject(CPCQuestionProvider);
		spyOn(store$, 'dispatch');
	}));

	afterEach(() => {
		fixture.destroy();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Class', () => {
		describe('ngOnInit', () => {
			it('should call through to the base page init method', () => {
				spyOn(WaitingRoomToCarBasePageComponent.prototype, 'onInitialisation');
				component.ngOnInit();
				expect(WaitingRoomToCarBasePageComponent.prototype.onInitialisation).toHaveBeenCalled();
			});
		});
		describe('combinationSelected', () => {
			it('should receive a combination selection and emit actions for questions to populate state', () => {
				const questions: Question[] = new CpcQuestionsMock().getQuestionsBank();
				spyOn(cpcQuestionProvider, 'getQuestionsBank').and.returnValue(questions);
				spyOn(cpcQuestionProvider, 'getQuestion5ByVehicleType').and.returnValue({} as Question5);
				component.combinationSelected('LGV1');
				expect(cpcQuestionProvider.getQuestionsBank).toHaveBeenCalledWith('LGV1');
				expect(cpcQuestionProvider.getQuestion5ByVehicleType).toHaveBeenCalledWith('LGV1');
				expect(store$.dispatch).toHaveBeenCalledWith(PopulateCombination('LGV1'));
				expect(store$.dispatch).toHaveBeenCalledWith(PopulateQuestions([...questions, {}] as Question[]));
			});
		});
		describe('vehicleConfiguration', () => {
			it('should dispatch the PopulateVehicleConfiguration action', () => {
				component.vehicleConfiguration('Articulated');
				expect(store$.dispatch).toHaveBeenCalledWith(PopulateVehicleConfiguration('Articulated'));
			});
		});
		describe('ionViewDidLeave', () => {
			it('should unsubscribe from the subscription if there is one', () => {
				component.subscription = new Subscription();
				spyOn(component.subscription, 'unsubscribe');
				component.ionViewDidLeave();
				expect(component.subscription.unsubscribe).toHaveBeenCalled();
			});
		});
		describe('onSubmit', () => {
			beforeEach(() => {
				spyOn(routeByCategoryProvider, 'navigateToPage');
			});
			it('should recognise a valid form and navigate to test report', fakeAsync(async () => {
				component.form = new UntypedFormGroup({
					notRequiredControl: new UntypedFormControl(null),
				});
				component.testCategory = TestCategory.CCPC;
				await component.onSubmit();
				tick();
				expect(routeByCategoryProvider.navigateToPage).toHaveBeenCalledWith(
					TestFlowPageNames.TEST_REPORT_PAGE,
					TestCategory.CCPC,
					{ replaceUrl: true }
				);
			}));
			it('should dispatch the appropriate WaitingRoomToCarValidationError actions', fakeAsync(async () => {
				component.form = new UntypedFormGroup({
					requiredControl1: new UntypedFormControl(null, [Validators.required]),
					requiredControl2: new UntypedFormControl(null, [Validators.required]),
					notRequiredControl: new UntypedFormControl(null),
				});

				await component.onSubmit();
				tick();
				expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl1 is blank'));
				expect(store$.dispatch).toHaveBeenCalledWith(WaitingRoomToCarValidationError('requiredControl2 is blank'));
				expect(store$.dispatch).not.toHaveBeenCalledWith(
					WaitingRoomToCarValidationError('notRequiredControl is blank')
				);
			}));
		});
	});
});
