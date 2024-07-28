import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AppModule } from '@app/app.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { NavController, Platform } from '@ionic/angular';
import { NavControllerMock, PlatformMock, RouterMock } from '@mocks/index.mock';
import { Store } from '@ngrx/store';
import { PassCertificateNumberComponent } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import { PassFinalisationValidationError } from '@pages/pass-finalisation/pass-finalisation.actions';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { StoreModel } from '@shared/models/store.model';
import { PersistTests } from '@store/tests/tests.actions';
import { MockComponent } from 'ng-mocks';
import { Observable, Subscription } from 'rxjs';
import { PassFinalisationCatCPCPage } from '../pass-finalisation.cat-cpc.page';

describe('PassFinalisationCatCPCPage', () => {
	let fixture: ComponentFixture<PassFinalisationCatCPCPage>;
	let component: PassFinalisationCatCPCPage;
	let store$: Store<StoreModel>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			declarations: [
				PassFinalisationCatCPCPage,
				MockComponent(PracticeModeBanner),
				MockComponent(PassCertificateNumberComponent),
				MockComponent(DebriefWitnessedComponent),
				MockComponent(FinalisationHeaderComponent),
				MockComponent(LanguagePreferencesComponent),
				MockComponent(WarningBannerComponent),
			],
			imports: [RouterModule.forRoot([]), AppModule],
			providers: [
				{
					provide: Platform,
					useClass: PlatformMock,
				},
				{
					provide: Router,
					useClass: RouterMock,
				},
				{
					provide: AuthenticationProvider,
					useClass: AuthenticationProviderMock,
				},
				{
					provide: NavController,
					useClass: NavControllerMock,
				},
				OutcomeBehaviourMapProvider,
			],
		});

		fixture = TestBed.createComponent(PassFinalisationCatCPCPage);
		component = fixture.componentInstance;
		store$ = TestBed.inject(Store);
		spyOn(store$, 'dispatch');
		component.subscription = new Subscription();
	}));

	describe('Class', () => {
		describe('ionViewDidLeave', () => {
			it('should unsubscribe from subscription if there is one', () => {
				component.subscription = new Subscription();
				spyOn(component.subscription, 'unsubscribe');
				component.ionViewDidLeave();
				expect(component.subscription.unsubscribe).toHaveBeenCalled();
			});
		});
		describe('ionViewWillEnter', () => {
			it('should setup subscription if merged is present', () => {
				component.merged$ = new Observable<string | boolean>();
				component.ionViewWillEnter();

				expect(component.subscription).toBeDefined();
			});
		});
		describe('onSubmit', () => {
			it('should dispatch the PersistTests action', () => {
				component.onSubmit();
				expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
			});
			it('should dispatch the appropriate ValidationError actions', fakeAsync(() => {
				component.form = new UntypedFormGroup({
					requiredControl1: new UntypedFormControl(null, [Validators.required]),
					requiredControl2: new UntypedFormControl(null, [Validators.required]),
					[PASS_CERTIFICATE_NUMBER_CTRL]: new UntypedFormControl(null, [Validators.required]),
					notRequiredControl: new UntypedFormControl(null),
				});

				component.onSubmit();
				tick();
				expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl1 is blank'));
				expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl2 is blank'));
				expect(store$.dispatch).toHaveBeenCalledWith(
					PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`)
				);
				expect(store$.dispatch).not.toHaveBeenCalledWith(
					PassFinalisationValidationError('notRequiredControl is blank')
				);
			}));
		});
	});
});
