import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { LanguageComponent } from '../language';

describe('LanguageComponent', () => {
  let component: LanguageComponent;
  let fixture: ComponentFixture<LanguageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LanguageComponent,
        MockComponent(HeaderComponent),
      ],
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
        const renderedText = fixture.debugElement.query(By.css('header-component'))
          .nativeElement;
        expect(renderedText.textContent).toBe(' Cymraeg ');
      });
      it('should not render text when the language is not Welsh', () => {
        component.welshLanguage = false;
        fixture.detectChanges();
        const renderedText = fixture.debugElement.queryAll(By.css('header-component'));
        expect(renderedText.length).toBe(0);
      });
    });
  });
});
