import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ProgressiveAccessComponent } from '../progressive-access';

describe('ProgressiveAccessComponent', () => {
  let component: ProgressiveAccessComponent;
  let fixture: ComponentFixture<ProgressiveAccessComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressiveAccessComponent],
      imports: [IonicModule],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgressiveAccessComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    describe('Welsh language indicator description', () => {
      it('should render text when the language is Welsh', () => {
        component.progressiveAccess = true;
        fixture.detectChanges();
        const renderedText = fixture.debugElement.query(By.css('h6.language-description'))
          .nativeElement;
        expect(renderedText.textContent).toBe('PROG');
      });
      it('should not render text when the language is not Welsh', () => {
        component.progressiveAccess = false;
        fixture.detectChanges();
        const renderedText = fixture.debugElement.queryAll(By.css('h6.language-description'));
        expect(renderedText.length).toBe(0);
      });
    });
  });
});
