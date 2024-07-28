import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { By } from '@angular/platform-browser';
import { AppModule } from '@app/app.module';
import { default as welshTranslations } from '@assets/i18n/cy.json';
import { ComponentsModule } from '@components/common/common-components.module';
import { StoreModule } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { configureI18N } from '@shared/helpers/translation.helpers';
import { PipesModule } from '@shared/pipes/pipes.module';
import { Language } from '@store/tests/communication-preferences/communication-preferences.model';
import { Competencies } from '@store/tests/test-data/test-data.constants';
import { DangerousFaultsDebriefCardComponent } from '../dangerous-faults-debrief-card';

describe('DangerousFaultsDebriefCardComponent', () => {
	let fixture: ComponentFixture<DangerousFaultsDebriefCardComponent>;
	let component: DangerousFaultsDebriefCardComponent;
	let translate: TranslateService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [DangerousFaultsDebriefCardComponent],
			imports: [IonicModule, AppModule, ComponentsModule, StoreModule.forRoot({}), TranslateModule, PipesModule],
		});

		fixture = TestBed.createComponent(DangerousFaultsDebriefCardComponent);
		component = fixture.componentInstance;
		translate = TestBed.inject(TranslateService);
		translate.setDefaultLang('en');
	}));

	describe('DOM', () => {
		it('correct dangerous faults showing', () => {
			const dangerousFaults = [Competencies.ancillaryControls, Competencies.clearance];
			component.dangerousFaults = dangerousFaults;
			fixture.detectChanges();
			const dangerousLabels = fixture.debugElement.queryAll(By.css('#dangerous-fault .counter-label'));
			const dangerousCounts = fixture.debugElement.query(By.css('ion-text.fault-heading')).nativeElement;
			expect(dangerousLabels[0].nativeElement.innerHTML.trim()).toBe('Control - Ancillary controls');
			expect(dangerousLabels[1].nativeElement.innerHTML.trim()).toBe('Clearance');
			expect(dangerousCounts.innerHTML).toBe(dangerousFaults.length.toString());
		});

		it('correct dangerous faults showing in welsh', (done) => {
			configureI18N(Language.CYMRAEG, translate);
			const dangerousFaults = [Competencies.ancillaryControls];
			component.dangerousFaults = dangerousFaults;
			translate.onLangChange.subscribe(() => {
				fixture.detectChanges();
				const dangerousLabels = fixture.debugElement.queryAll(By.css('#dangerous-fault .counter-label'));
				const dangerousCounts = fixture.debugElement.query(By.css('ion-text.fault-heading')).nativeElement;
				expect(dangerousLabels[0].nativeElement.innerHTML.trim()).toBe(
					(<any>welshTranslations).debrief.competencies.ancillaryControls
				);
				expect(dangerousCounts.innerHTML).toBe(dangerousFaults.length.toString());
				done();
			});
		});

		it('no dangerous faults showing', () => {
			component.dangerousFaults = [];
			fixture.detectChanges();
			expect(fixture.debugElement.query(By.css('#dangerous-fault'))).toBeNull();
		});
	});
});
