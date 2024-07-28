import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { LanguageComponent } from '../language';

describe('LanguageComponent', () => {
	let component: LanguageComponent;
	let fixture: ComponentFixture<LanguageComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [LanguageComponent],
			imports: [IonicModule],
		});

		fixture = TestBed.createComponent(LanguageComponent);
		component = fixture.componentInstance;
	}));

	describe('DOM', () => {
		describe('Welsh language image indicator', () => {
			it('should render an image when the language is Welsh', () => {
				component.welshLanguage = true;
				fixture.detectChanges();
				const renderedImage = fixture.debugElement.query(By.css('img'));
				expect(renderedImage.attributes.src).toContain('welsh-red-dragon-hi');
			});
			it('should not render an image when the language is not Welsh', () => {
				component.welshLanguage = false;
				fixture.detectChanges();
				const renderedImage = fixture.debugElement.queryAll(By.css('img'));
				expect(renderedImage.length).toBe(0);
			});
		});

		describe('Welsh language indicator description', () => {
			it('should render text when the language is Welsh', () => {
				component.welshLanguage = true;
				fixture.detectChanges();
				const renderedText = fixture.debugElement.query(By.css('ion-text')).nativeElement;
				expect(renderedText.textContent).toBe('Cymraeg');
			});
			it('should not render text when the language is not Welsh', () => {
				component.welshLanguage = false;
				fixture.detectChanges();
				const renderedText = fixture.debugElement.queryAll(By.css('ion-text'));
				expect(renderedText.length).toBe(0);
			});
		});
	});
});
