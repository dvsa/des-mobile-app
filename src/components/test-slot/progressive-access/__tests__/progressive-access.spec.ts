import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';
import { HeaderComponent } from '@components/common/header-component/header.component';
import { ProgressiveAccessComponent } from '../progressive-access';

describe('ProgressiveAccessComponent', () => {
  let component: ProgressiveAccessComponent;
  let fixture: ComponentFixture<ProgressiveAccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProgressiveAccessComponent,
        MockComponent(HeaderComponent),
      ],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(ProgressiveAccessComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    describe('Welsh language indicator description', () => {
      it('should render text when the language is Welsh', () => {
        component.progressiveAccess = true;
        fixture.detectChanges();
        const renderedText = fixture.debugElement.query(By.css('header-component'))
          .nativeElement;
        expect(renderedText.textContent).toBe(' PROG ');
      });
      it('should not render text when the language is not Welsh', () => {
        component.progressiveAccess = false;
        fixture.detectChanges();
        const renderedText = fixture.debugElement.queryAll(By.css('header-component'));
        expect(renderedText.length).toBe(0);
      });
    });
  });
});
