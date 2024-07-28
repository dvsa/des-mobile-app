import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestRecoveredBannerComponent } from '@components/common/test-recovered-banner/test-recovered-banner';
import { IonicModule } from '@ionic/angular';

describe('TestRecoveredBannerComponent', () => {
	let component: TestRecoveredBannerComponent;
	let fixture: ComponentFixture<TestRecoveredBannerComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TestRecoveredBannerComponent],
			imports: [IonicModule],
		});

		fixture = TestBed.createComponent(TestRecoveredBannerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
