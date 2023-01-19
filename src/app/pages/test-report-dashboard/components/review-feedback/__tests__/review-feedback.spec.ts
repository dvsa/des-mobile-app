import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { ReviewFeedback } from '@pages/test-report-dashboard/components/review-feedback/review-feedback';
import { UntypedFormGroup } from '@angular/forms';

describe('ReviewFeedback', () => {
  let fixture: ComponentFixture<ReviewFeedback>;
  let component: ReviewFeedback;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewFeedback],
      imports: [
        IonicModule,
      ],
      providers: [
        provideMockStore({ ...{} }),

      ],
    });

    fixture = TestBed.createComponent(ReviewFeedback);
    component = fixture.componentInstance;
  }));

  describe('charactersExceeded', () => {
    it('should return true if charactersExceeded is less than 0', () => {
      component.feedbackCharsRemaining = -1;
      expect(component.charactersExceeded()).toBe(true);
    });
    it('should return false if charactersExceeded is not less than 0', () => {
      component.feedbackCharsRemaining = 1;
      expect(component.charactersExceeded()).toBe(false);
    });
  });

  describe('feedbackChanged', () => {
    it('should emit getCharacterCountText with correct parameters', () => {
      spyOn(component.feedbackChange, 'emit');
      component.feedbackChanged('feedback');
      expect(component.feedbackChange.emit).toHaveBeenCalledWith('feedback');
    });
  });

  describe('getCharacterCountText', () => {
    it('should display "You have 1 character remaining" when only 1 is remaining', () => {
      component.feedbackCharsRemaining = 1;

      expect(component.getCharacterCountText()).toBe('You have 1 character remaining');
    });
    it('should display "You have 2 characters remaining" when only 1 is remaining', () => {
      component.feedbackCharsRemaining = 2;

      expect(component.getCharacterCountText()).toBe('You have 2 characters remaining');
    });
  });

  describe('characterCountChanged', () => {
    it('should change feedbackCharsRemaining to the parameter passed in', () => {
      component.characterCountChanged(1);
      expect(component.feedbackCharsRemaining).toBe(1);
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.form = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});
