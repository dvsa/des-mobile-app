import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { IndicatorsComponent } from '../indicators';

xdescribe('IndicatorsComponent', () => {
  let component: IndicatorsComponent;
  let fixture: ComponentFixture<IndicatorsComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorsComponent],
      imports: [IonicModule],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(IndicatorsComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    describe('exclamation indicator', () => {
      it('should render when visibility is configured', () => {
        component.showExclamationIndicator = true;
        component.testStatus = TestStatus.Booked;
        fixture.detectChanges();
        const renderedImage = fixture.debugElement.query(By.css('.exclamation-indicator'));
        expect(renderedImage.attributes.src).toContain('exclamation');
      });
      it('should not be rendered when visibility is turned off', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Booked;
        fixture.detectChanges();
        const renderedImages = fixture.debugElement.queryAll(By.css('.exclamation-indicator'));
        expect(renderedImages.length).toBe(0);
      });
      it('should not be rendered when test status is submitted', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Submitted;
        fixture.detectChanges();
        const renderedImages = fixture.debugElement.queryAll(By.css('.exclamation-indicator'));
        expect(renderedImages.length).toBe(0);
      });
    });
    describe('green tick indicator', () => {
      it('should be rendered when test status is submitted', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Submitted;
        fixture.detectChanges();
        const renderedImage = fixture.debugElement.query(By.css('.green-tick-indicator'));
        expect(renderedImage.attributes.src).toContain('tick');
      });
      it('should not rendered when test status is not submitted', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Booked;
        fixture.detectChanges();
        const renderedImages = fixture.debugElement.queryAll(By.css('.green-tick-indicator'));
        expect(renderedImages.length).toBe(0);
      });
    });
  });
});
