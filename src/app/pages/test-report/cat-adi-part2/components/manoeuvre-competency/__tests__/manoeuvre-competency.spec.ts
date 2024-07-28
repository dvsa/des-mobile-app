import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { IonicModule } from '@ionic/angular';
import { Store, StoreModule } from '@ngrx/store';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { NavigationStateProviderMock } from '@providers/navigation-state/__mocks__/navigation-state.mock';
import { NavigationStateProvider } from '@providers/navigation-state/navigation-state';
import { CompetencyOutcome } from '@shared/models/competency-outcome';
import { StoreModel } from '@shared/models/store.model';
import {
	AddManoeuvreDangerousFault,
	AddManoeuvreDrivingFault,
	AddManoeuvreSeriousFault,
	RemoveManoeuvreFault,
} from '@store/tests/test-data/cat-adi-part2/manoeuvres/manoeuvres.actions';
import { ManoeuvreCompetencies, ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { MockComponent } from 'ng-mocks';
import {
	ToggleDangerousFaultMode,
	ToggleRemoveFaultMode,
	ToggleSeriousFaultMode,
} from '../../../../test-report.actions';
import { testReportReducer } from '../../../../test-report.reducer';
import { ManoeuvreCompetencyComponentAdiPart2 } from '../manoeuvre-competency';

describe('ManoeuvreCompetencyComponentAdiPart2', () => {
	let fixture: ComponentFixture<ManoeuvreCompetencyComponentAdiPart2>;
	let component: ManoeuvreCompetencyComponentAdiPart2;
	let store$: Store<StoreModel>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				ManoeuvreCompetencyComponentAdiPart2,
				MockComponent(DrivingFaultsBadgeComponent),
				MockComponent(SeriousFaultBadgeComponent),
				MockComponent(DangerousFaultBadgeComponent),
			],
			imports: [
				AppModule,
				IonicModule,
				StoreModule.forRoot({
					journal: () => ({
						isLoading: false,
						lastRefreshed: null,
						slots: {},
						selectedDate: '',
						examiner: {
							staffNumber: '1234567',
						},
					}),
					tests: () => ({
						currentTest: {
							slotId: '123',
						},
						testStatus: {},
						startedTests: {
							123: {
								vehicleDetails: {},
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
										showMeQuestion: {
											code: 'S3',
											description: '',
											outcome: '',
										},
										tellMeQuestion: {
											code: '',
											description: '',
											outcome: '',
										},
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
					testReport: testReportReducer,
				}),
			],
			providers: [
				{ provide: DateTimeProvider, useClass: DateTimeProviderMock },
				{ provide: NavigationStateProvider, useClass: NavigationStateProviderMock },
			],
		});

		fixture = TestBed.createComponent(ManoeuvreCompetencyComponentAdiPart2);
		component = fixture.componentInstance;
		component.index = 0;
		store$ = TestBed.inject(Store);
	}));

	describe('DOM', () => {
		it('should display the correct driving fault badge with a count of 1', () => {
			component.manoeuvre = ManoeuvreTypes.reverseRight;
			component.competency = ManoeuvreCompetencies.controlFault;
			component.manoeuvreCompetencyOutcome = 'DF';
			const result = component.hasDrivingFault();
			fixture.detectChanges();
			const drivingFaultsBadge = fixture.debugElement.query(By.css('.driving-faults')).componentInstance;
			expect(drivingFaultsBadge).toBeDefined();
			expect(result).toEqual(1);
		});
	});

	describe('Class', () => {
		it('should get the competency label from the correct object', () => {
			component.manoeuvre = ManoeuvreTypes.reverseRight;
			component.competency = ManoeuvreCompetencies.controlFault;
			fixture.detectChanges();
			const result = component.getLabel();
			const expected = 'Control';
			expect(result).toEqual(expected);
		});

		describe('hasDrivingFault', () => {
			it('should return 0 when not driving fault', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.S;
				fixture.detectChanges();

				const result = component.hasDrivingFault();
				expect(result).toBe(0);
			});

			it('should return 1 when has a driving fault', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.DF;

				const result = component.hasDrivingFault();
				expect(result).toBe(1);
			});
		});

		describe('hasSeriousFault', () => {
			it('should return false if it does not have a serious fault', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.DF;

				const result = component.hasSeriousFault();
				expect(result).toBe(false);
			});

			it('should return true if it has a serious fault', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.S;

				const result = component.hasSeriousFault();
				expect(result).toBe(true);
			});
		});

		describe('hasDangerousFault', () => {
			it('should return false if it does not have a dangerous fault', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.DF;

				const result = component.hasDangerousFault();
				expect(result).toBe(false);
			});

			it('should return true if it has a dangerous fault', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.D;

				const result = component.hasDangerousFault();
				expect(result).toBe(true);
			});
		});

		describe('addFault', () => {
			it('should dispatch a ADD_MANOEUVRE_DANGEROUS_FAULT action if dangerous mode is active on press', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.isDangerousMode = true;

				const storeDispatchSpy = spyOn(store$, 'dispatch');
				component.addOrRemoveFault();

				expect(storeDispatchSpy).toHaveBeenCalledWith(
					AddManoeuvreDangerousFault(
						{
							manoeuvre: component.manoeuvre,
							competency: component.competency,
						},
						0
					)
				);
				expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
			});

			it('should dispatch a ADD_MANOEUVRE_SERIOUS_FAULT action if serious mode is active on press', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.isSeriousMode = true;

				const storeDispatchSpy = spyOn(store$, 'dispatch');
				component.addOrRemoveFault();

				expect(storeDispatchSpy).toHaveBeenCalledWith(
					AddManoeuvreSeriousFault(
						{
							manoeuvre: component.manoeuvre,
							competency: component.competency,
						},
						0
					)
				);
				expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
			});

			it('should dispatch a ADD_MANOEUVRE_DRIVING_FAULT action if simple driving fault mode is active on press', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;

				const storeDispatchSpy = spyOn(store$, 'dispatch');
				component.addOrRemoveFault(true);

				expect(storeDispatchSpy).toHaveBeenCalledWith(
					AddManoeuvreDrivingFault(
						{
							manoeuvre: component.manoeuvre,
							competency: component.competency,
						},
						0
					)
				);
			});
		});

		describe('AddManoeuvreDrivingFault', () => {
			it('should dispatch the correct action when the competency is a manoeuvre', () => {
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				fixture.detectChanges();
				const storeDispatchSpy = spyOn(store$, 'dispatch');
				component.addOrRemoveFault(true);

				expect(storeDispatchSpy).toHaveBeenCalledWith(
					AddManoeuvreDrivingFault(
						{
							manoeuvre: component.manoeuvre,
							competency: component.competency,
						},
						0
					)
				);
			});
		});

		describe('Remove faults', () => {
			describe('dispatched the actions competency outcome is undefined', () => {
				beforeEach(() => {
					fixture.detectChanges();
					component.manoeuvre = ManoeuvreTypes.reverseRight;
					component.competency = ManoeuvreCompetencies.controlFault;
					component.isRemoveFaultMode = true;
					component.manoeuvreCompetencyOutcome = undefined;
				});
				it('should only toggle remove fault when remove fault mode is true', () => {
					fixture.detectChanges();
					const storeDispatchSpy = spyOn(store$, 'dispatch');
					component.addOrRemoveFault();
					expect(storeDispatchSpy).toHaveBeenCalledTimes(1);
					expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
				});
				it('should only toggle remove and serious fault when remove and serious fault modes are true', () => {
					component.isSeriousMode = true;
					fixture.detectChanges();
					const storeDispatchSpy = spyOn(store$, 'dispatch');
					component.addOrRemoveFault();
					expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
					expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
					expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
				});
				it('should only toggle remove and serious fault when remove and serious fault modes are true', () => {
					component.isDangerousMode = true;
					fixture.detectChanges();
					const storeDispatchSpy = spyOn(store$, 'dispatch');
					component.addOrRemoveFault();
					expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
					expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
					expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
				});
			});
			it('should remove a dangerous fault and toggle dangerous mode when dangerous mode is true', () => {
				fixture.detectChanges();
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.isRemoveFaultMode = true;
				component.isDangerousMode = true;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.D;
				fixture.detectChanges();
				const storeDispatchSpy = spyOn(store$, 'dispatch');
				component.addOrRemoveFault();
				expect(storeDispatchSpy).toHaveBeenCalledTimes(3);
				expect(storeDispatchSpy).toHaveBeenCalledWith(
					RemoveManoeuvreFault(
						{
							competency: component.competency,
							manoeuvre: component.manoeuvre,
						},
						0,
						CompetencyOutcome.D
					)
				);
				expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
				expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleDangerousFaultMode());
			});
			it('should remove a serious fault and toggle serious mode when serious mode is true', () => {
				fixture.detectChanges();
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.isRemoveFaultMode = true;
				component.isSeriousMode = true;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.S;
				fixture.detectChanges();
				const storeDispatchSpy = spyOn(store$, 'dispatch');
				component.addOrRemoveFault();
				expect(storeDispatchSpy).toHaveBeenCalledTimes(3);
				expect(storeDispatchSpy).toHaveBeenCalledWith(
					RemoveManoeuvreFault(
						{
							competency: component.competency,
							manoeuvre: component.manoeuvre,
						},
						0,
						CompetencyOutcome.S
					)
				);
				expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
				expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleSeriousFaultMode());
			});
			it('should remove a driving fault and toggle remove mode', () => {
				fixture.detectChanges();
				component.manoeuvre = ManoeuvreTypes.reverseRight;
				component.competency = ManoeuvreCompetencies.controlFault;
				component.isRemoveFaultMode = true;
				component.manoeuvreCompetencyOutcome = CompetencyOutcome.DF;
				fixture.detectChanges();
				const storeDispatchSpy = spyOn(store$, 'dispatch');
				component.addOrRemoveFault();
				expect(storeDispatchSpy).toHaveBeenCalledTimes(2);
				expect(storeDispatchSpy).toHaveBeenCalledWith(
					RemoveManoeuvreFault(
						{
							competency: component.competency,
							manoeuvre: component.manoeuvre,
						},
						0,
						CompetencyOutcome.DF
					)
				);
				expect(storeDispatchSpy).toHaveBeenCalledWith(ToggleRemoveFaultMode());
			});
		});
	});
});
