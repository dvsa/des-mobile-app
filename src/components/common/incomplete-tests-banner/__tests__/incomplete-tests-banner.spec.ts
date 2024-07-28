import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { DateTimeProviderMock } from '@providers/date-time/__mocks__/date-time.mock';
import { DateTimeProvider } from '@providers/date-time/date-time';
import { SlotProvider } from '@providers/slot/slot';
import { journalReducer } from '@store/journal/journal.reducer';
import { testsReducer } from '@store/tests/tests.reducer';
import { of } from 'rxjs';
import { IncompleteTestsBanner } from '../incomplete-tests-banner';

describe('IncompleteTestsBanner', () => {
	let fixture: ComponentFixture<IncompleteTestsBanner>;
	let component: IncompleteTestsBanner;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [IncompleteTestsBanner],
			imports: [
				IonicModule,
				StoreModule.forRoot({
					tests: testsReducer,
					journal: journalReducer,
				}),
			],
			providers: [
				{ provide: DateTimeProvider, useClass: DateTimeProviderMock },
				{ provide: SlotProvider, useClass: SlotProvider },
				{ provide: AppConfigProvider, useClass: AppConfigProviderMock },
			],
		});

		fixture = TestBed.createComponent(IncompleteTestsBanner);
		component = fixture.componentInstance;
	}));

	describe('DOM', () => {
		it('should display the number of incomplete tests', () => {
			fixture.detectChanges();
			component.componentState = { count$: of([{}].length as number) };

			fixture.detectChanges();
			const rendered = fixture.debugElement.query(By.css('span')).nativeElement.innerHTML;
			expect(rendered).toBe('You have an incomplete test');
		});
		it('should display the number of incomplete tests as plural', () => {
			fixture.detectChanges();
			component.componentState = { count$: of([{}, {}].length as number) };

			fixture.detectChanges();
			const rendered = fixture.debugElement.query(By.css('span')).nativeElement.innerHTML;
			expect(rendered).toBe('You have incomplete tests');
		});
		it('should not be visible when the fault count is 0', () => {
			fixture.detectChanges();
			component.componentState = { count$: of([].length as number) };

			fixture.detectChanges();
			const rendered = fixture.debugElement.query(By.css('div'));
			expect(rendered).toBeNull();
		});
	});

	describe('getIncompleteText', () => {
		it('should return a message for multiple tests', () => {
			expect(component.getIncompleteText(2)).toEqual('You have incomplete tests');
		});

		it('should return a message for a single test', () => {
			expect(component.getIncompleteText(1)).toEqual('You have an incomplete test');
		});
	});
});
