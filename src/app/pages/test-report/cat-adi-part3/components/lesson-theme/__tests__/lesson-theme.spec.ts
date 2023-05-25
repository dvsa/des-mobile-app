import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UntypedFormGroup } from '@angular/forms';
import { LessonThemeComponent } from '@pages/test-report/cat-adi-part3/components/lesson-theme/lesson-theme';
import { MockComponent } from 'ng-mocks';
import {
  AssessmentAnswerComponent,
} from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';
import { HeaderComponent } from '@components/common/header-component/header.component';

describe('LessonThemeComponent', () => {
  let fixture: ComponentFixture<LessonThemeComponent>;
  let component: LessonThemeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LessonThemeComponent,
        MockComponent(HeaderComponent),
        MockComponent(AssessmentAnswerComponent),
      ],
      imports: [
        IonicModule,
      ],
    });

    fixture = TestBed.createComponent(LessonThemeComponent);
    component = fixture.componentInstance;
  }));

  describe('charactersExceeded', () => {
    it('should return true if feedbackCharsRemaining is less than 0', () => {
      component.feedbackCharsRemaining = -1;
      expect(component.charactersExceeded()).toBe(true);
    });
    it('should return false if feedbackCharsRemaining is not less than 0', () => {
      component.feedbackCharsRemaining = 1;
      expect(component.charactersExceeded()).toBe(false);
    });
  });

  describe('otherReasoningChanged', () => {
    it('should emit getCharacterCountText with correct parameters', () => {
      spyOn(component.otherReasoningChange, 'emit');
      component.otherReasoningChanged('feedback');
      expect(component.otherReasoningChange.emit).toHaveBeenCalledWith('feedback');
    });
  });

  describe('lessonThemeChanged', () => {
    it('should emit lessonThemeChange with correct parameters', () => {
      component.lessonThemes = ['junctions'];
      spyOn(component.lessonThemeChange, 'emit');

      component.lessonThemeChanged('junctions');
      expect(component.lessonThemeChange.emit).toHaveBeenCalledWith({ lessonTheme: 'junctions', added: false });
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

  describe('defineComparator', () => {
    it('should return the string passed in if lesson theme includes it', () => {
      component.lessonThemes = ['junctions'];
      expect(component.defineComparator('junctions')).toBe('junctions');
    });
    it('should return blank if lesson theme does not include the string passed in', () => {
      component.lessonThemes = ['junctions'];
      expect(component.defineComparator('test')).toBe('');
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(('test'.repeat(250)));
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});
