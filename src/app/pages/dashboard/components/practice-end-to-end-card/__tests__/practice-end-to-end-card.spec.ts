import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { FAKE_JOURNAL_PAGE } from '@pages/page-names.constants';
import { PracticeEndToEndCardComponent } from '../practice-end-to-end-card';

describe('PracticeEndToEndCard ', () => {
	let component: PracticeEndToEndCardComponent;
	let fixture: ComponentFixture<PracticeEndToEndCardComponent>;
	let router: Router;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PracticeEndToEndCardComponent],
			imports: [IonicModule],
			providers: [{ provide: Router, useClass: RouterMock }],
		});

		fixture = TestBed.createComponent(PracticeEndToEndCardComponent);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
	}));

	describe('Class', () => {
		describe('navigateToFakeJournal', () => {
			it('should trigger navigation to Fake Journal', async () => {
				spyOn(router, 'navigate');
				await component.navigateToFakeJournal();
				expect(router.navigate).toHaveBeenCalledWith([FAKE_JOURNAL_PAGE]);
			});
		});
	});
});
