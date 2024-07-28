import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { TickIndicatorComponent } from '@components/common/tick-indicator/tick-indicator';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonicModule, ModalController, NavParams, Platform } from '@ionic/angular';
import { ModalControllerMock, NavParamsMock, PlatformMock } from '@mocks/index.mock';
import { StoreModule } from '@ngrx/store';
import { SafetyAndBalanceComponent } from '@pages/test-report/cat-a-mod2/components/safety-and-balance/safety-and-balance';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { TestReportValidatorProviderMock } from '@providers/test-report-validator/__mocks__/test-report-validator.mock';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { candidateMock } from '@store/tests/__mocks__/tests.mock';
import { initialState } from '@store/tests/test-data/cat-a-mod2/test-data.cat-a-mod2.reducer';
import { MockComponent } from 'ng-mocks';
import { CompetencyButtonComponent } from '../../components/competency-button/competency-button';
import { CompetencyComponent } from '../../components/competency/competency';
import { DrivingFaultSummaryComponent } from '../../components/driving-fault-summary/driving-fault-summary';
import { EcoComponent } from '../../components/eco/eco';
import { EtaComponent } from '../../components/examiner-takes-action/eta';
import { LegalRequirementComponent } from '../../components/legal-requirement/legal-requirement';
import { ToolbarComponent } from '../../components/toolbar/toolbar';
import { testReportReducer } from '../../test-report.reducer';
import { TestReportCatAMod2Page } from '../test-report.cat-a-mod2.page';

describe('TestReportCatAMod2Page', () => {
	let fixture: ComponentFixture<TestReportCatAMod2Page>;
	let component: TestReportCatAMod2Page;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestReportCatAMod2Page,
				MockComponent(TickIndicatorComponent),
				MockComponent(CompetencyComponent),
				MockComponent(CompetencyButtonComponent),
				MockComponent(LegalRequirementComponent),
				MockComponent(EtaComponent),
				MockComponent(DrivingFaultSummaryComponent),
				MockComponent(ToolbarComponent),
				MockComponent(EcoComponent),
				MockComponent(PracticeModeBanner),
				MockComponent(SafetyAndBalanceComponent),
			],
			imports: [
				IonicModule,
				AppModule,
				StoreModule.forFeature('tests', () => ({
					currentTest: {
						slotId: '123',
					},
					testStatus: {},
					startedTests: {
						123: {
							category: TestCategory.EUAM2,
							testData: initialState,
							delegatedTest: false,
							journalData: {
								candidate: candidateMock,
							},
						},
					},
				})),
				StoreModule.forFeature('testReport', testReportReducer),
			],
			providers: [
				{
					provide: NavParams,
					useClass: NavParamsMock,
				},
				{
					provide: Platform,
					useClass: PlatformMock,
				},
				{
					provide: AuthenticationProvider,
					useClass: AuthenticationProviderMock,
				},
				{
					provide: DateTimeProvider,
					useClass: DateTimeProviderMock,
				},
				{
					provide: ModalController,
					useClass: ModalControllerMock,
				},
				{
					provide: TestReportValidatorProvider,
					useClass: TestReportValidatorProviderMock,
				},
			],
		});

		fixture = TestBed.createComponent(TestReportCatAMod2Page);
		component = fixture.componentInstance;
	});

	describe('DOM', () => {
		describe('Fault Modes Styling', () => {
			it('should not have any fault mode styles applied when serious and dangerous mode is disabled', () => {
				expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
				expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
			});
			it('should have serious fault mode styles applied when serious mode is enabled', () => {
				component.isSeriousMode = true;
				fixture.detectChanges();
				expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeDefined();
				expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeNull();
			});
			it('should have dangerous fault mode styles applied when dangerous mode is enabled', () => {
				component.isDangerousMode = true;
				fixture.detectChanges();
				expect(fixture.debugElement.query(By.css('.serious-mode'))).toBeNull();
				expect(fixture.debugElement.query(By.css('.dangerous-mode'))).toBeDefined();
			});
		});
	});

	describe('ionViewDidLeave', () => {
		it('should run basePageComponent functions', () => {
			spyOn(TestReportBasePageComponent.prototype, 'ionViewDidLeave');
			spyOn(TestReportBasePageComponent.prototype, 'cancelSubscription');
			component.ionViewDidLeave();

			expect(TestReportBasePageComponent.prototype.ionViewDidLeave).toHaveBeenCalled();
			expect(TestReportBasePageComponent.prototype.cancelSubscription).toHaveBeenCalled();
		});
	});

	describe('End Test Button', () => {
		it('should call the end test function', () => {
			spyOn(component, 'onEndTestClick');
			const endTestButton = fixture.debugElement.query(By.css('#end-test-button'));
			endTestButton.triggerEventHandler('click', null);
			expect(component.onEndTestClick).toHaveBeenCalled();
		});
	});
});
