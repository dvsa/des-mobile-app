import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TestStatus } from '@store/tests/test-status/test-status.model';
import { IndicatorsComponent } from '../indicators';

describe('IndicatorsComponent', () => {
  let component: IndicatorsComponent;
  let fixture: ComponentFixture<IndicatorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [IndicatorsComponent],
      imports: [IonicModule],
    });

    fixture = TestBed.createComponent(IndicatorsComponent);
    component = fixture.componentInstance;
  }));

  describe('DOM', () => {
    describe('exclamation indicator', () => {
      it('should render when visibility is configured', () => {
        component.showExclamationIndicator = true;
        component.testStatus = TestStatus.Booked;
        fixture.detectChanges();
        const renderedImage = fixture.debugElement.query(By.css('.exclamation'));
        expect(renderedImage.attributes.src).toContain('exclamation');
      });
      it('should not be rendered when visibility is turned off', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Booked;
        fixture.detectChanges();
        const renderedImages = fixture.debugElement.queryAll(By.css('.exclamation'));
        expect(renderedImages.length).toBe(0);
      });
      it('should not be rendered when test status is submitted', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Submitted;
        fixture.detectChanges();
        const renderedImages = fixture.debugElement.queryAll(By.css('.exclamation'));
        expect(renderedImages.length).toBe(0);
      });
    });
    describe('green tick indicator', () => {
      it('should be rendered when test status is submitted', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Submitted;
        fixture.detectChanges();
        const renderedImage = fixture.debugElement.query(By.css('.green-tick'));
        expect(renderedImage.attributes.src).toContain('tick');
      });
      it('should not rendered when test status is not submitted', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Booked;
        fixture.detectChanges();
        const renderedImages = fixture.debugElement.queryAll(By.css('.green-tick'));
        expect(renderedImages.length).toBe(0);
      });
    });
  });

  describe('Class', () => {
    describe('shouldShowExclamationIndicator', () => {
      it('should render when visibility is configured', () => {
        component.showExclamationIndicator = true;
        component.testStatus = TestStatus.Booked;
        expect(component.shouldShowExclamationIndicator()).toEqual(true);
      });
      it('should not be rendered when visibility is turned off', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Booked;
        expect(component.shouldShowExclamationIndicator()).toEqual(false);
      });
      it('should not be rendered when test status is submitted', () => {
        component.showExclamationIndicator = false;
        component.testStatus = TestStatus.Submitted;
        expect(component.shouldShowExclamationIndicator()).toEqual(false);
      });
    });
    describe('shouldShowGreenTickIndicator', () => {
      it('should be rendered when test status is submitted', () => {
        component.testStatus = TestStatus.Submitted;
        expect(component.shouldShowGreenTickIndicator()).toEqual(true);
      });
      it('should not rendered when test status is not submitted', () => {
        component.testStatus = TestStatus.Booked;
        expect(component.shouldShowGreenTickIndicator()).toEqual(false);
      });
    });
  });
});
