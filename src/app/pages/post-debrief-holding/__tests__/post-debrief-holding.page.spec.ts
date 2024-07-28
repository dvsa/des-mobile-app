import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppModule } from '@app/app.module';
import { PracticeModeBanner } from '@components/common/practice-mode-banner/practice-mode-banner';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { StoreModule } from '@ngrx/store';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { MockComponent } from 'ng-mocks';
import { PostDebriefHoldingPage } from '../post-debrief-holding.page';

describe('PostDebriefHoldingPage', () => {
	let fixture: ComponentFixture<PostDebriefHoldingPage>;
	let component: PostDebriefHoldingPage;
	let router: Router;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			schemas: [CUSTOM_ELEMENTS_SCHEMA],
			declarations: [PostDebriefHoldingPage, MockComponent(PracticeModeBanner)],
			imports: [RouterModule.forRoot([]), AppModule, StoreModule.forFeature('tests', () => ({}))],
			providers: [
				{
					provide: Router,
					useClass: RouterMock,
				},
			],
		});

		fixture = TestBed.createComponent(PostDebriefHoldingPage);
		component = fixture.componentInstance;
		router = TestBed.inject(Router);
		spyOn(router, 'navigate');
	}));

	describe('Class', () => {
		it('should create component', () => {
			expect(component).toBeTruthy();
		});

		describe('continueButton', () => {
			it('should call navigateToPage function', fakeAsync(async () => {
				await component.continueButton();
				tick();
				expect(router.navigate).toHaveBeenCalledWith([TestFlowPageNames.NON_PASS_FINALISATION_PAGE]);
			}));
		});
	});
});
