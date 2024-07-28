import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { createTranslateLoader } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { ProvidedEmailComponent } from '../provided-email';

describe('ProvidedEmailComponent', () => {
	let fixture: ComponentFixture<ProvidedEmailComponent>;
	let component: ProvidedEmailComponent;
	let translate: TranslateService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ProvidedEmailComponent],
			imports: [
				IonicModule,
				HttpClientModule,
				ReactiveFormsModule,
				TranslateModule.forRoot({
					loader: {
						provide: TranslateLoader,
						useFactory: createTranslateLoader,
						deps: [HttpClient],
					},
				}),
			],
		});

		fixture = TestBed.createComponent(ProvidedEmailComponent);
		component = fixture.componentInstance;
		component.formGroup = new UntypedFormGroup({});
		component.formGroup.addControl('radioCtrl', new UntypedFormControl());
		component.shouldRender = true;
		component.isProvidedEmailAddressChosen = true;
		translate = TestBed.inject(TranslateService);
		translate.setDefaultLang('en');
	}));

	describe('DOM', () => {
		describe('i18n', () => {
			it('should render in English by default', (done) => {
				translate.use('en').subscribe(() => {
					fixture.detectChanges();
					expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim()).toBe(
						'The following email address was used when booking the test:'
					);
					expect(fixture.debugElement.query(By.css('#providedEmail + label')).nativeElement.innerHTML.trim()).toBe(
						'By email (provided at time of booking)'
					);
					done();
				});
			});

			it('should render in Welsh when its a Welsh test', (done) => {
				translate.use('cy').subscribe(() => {
					fixture.detectChanges();
					expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim()).toBe(
						"Defnyddiwyd y cyfeiriad e-bost dilynol wrth archebu'r prawf:"
					);
					expect(fixture.debugElement.query(By.css('#providedEmail + label')).nativeElement.innerHTML.trim()).toBe(
						'Trwy e-bost (a ddarparwyd ar adeg archebu)'
					);
					done();
				});
			});
		});
	});

	describe('ngOnChanges', () => {
		it('should set up the  form control if there is not already one', () => {
			component.radioButtonControl = null;
			component.ngOnChanges();
			expect(component.formGroup.get(ProvidedEmailComponent.radioCtrl)).not.toBeNull();
		});
	});

	describe('providedEmailRadioSelected', () => {
		it('should emit newEmailRadioSelect with correct parameters', () => {
			spyOn(component.providedEmailRadioSelect, 'emit');
			component.providedEmailRadioSelected();
			expect(component.providedEmailRadioSelect.emit).toHaveBeenCalledWith(ProvidedEmailComponent.providedEmail);
		});
	});
});
