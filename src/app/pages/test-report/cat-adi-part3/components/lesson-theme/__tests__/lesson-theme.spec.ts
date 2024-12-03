import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AssessmentAnswerComponent } from '@pages/test-report/cat-adi-part3/components/assessment-answer/assessment-answer';
import { LessonThemeComponent } from '@pages/test-report/cat-adi-part3/components/lesson-theme/lesson-theme';
import { CharacterCountService } from '@providers/character-count/character-count.service';
import { MockComponent } from 'ng-mocks';

describe('LessonThemeComponent', () => {
  let characterCountService: CharacterCountService;
  let fixture: ComponentFixture<LessonThemeComponent>;
  let component: LessonThemeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LessonThemeComponent, MockComponent(AssessmentAnswerComponent)],
      imports: [IonicModule],
      providers: [{ provider: CharacterCountService, useClass: CharacterCountService }],
    });

    fixture = TestBed.createComponent(LessonThemeComponent);
    characterCountService = TestBed.inject(CharacterCountService);
    component = fixture.componentInstance;
  }));

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

  describe('characterCountChanged', () => {
    it('should change feedbackCharsRemaining to the parameter passed in', () => {
      component.formControl = new FormControl();
      component.characterCountChanged(1);
      expect(component.charsRemaining).toBe(1);
    });
    it('should check the validity of the form control', () => {
      component.formControl = new FormControl();
      spyOn(component.formControl, 'updateValueAndValidity');
      component.characterCountChanged(1);
      expect(component.formControl.updateValueAndValidity).toHaveBeenCalled();
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
      component.formControl = new UntypedFormControl(null, [Validators.required]);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = new UntypedFormControl(null, [Validators.required]);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = new UntypedFormControl(null, [Validators.required]);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = new UntypedFormControl(null, [Validators.required]);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });

  describe('getCharacterCountText', () => {
    it('should call service with charsRemaining', () => {
      spyOn(characterCountService, 'getCharacterCountText');
      component.charsRemaining = 1;
      component.getCharacterCountText();

      expect(characterCountService.getCharacterCountText).toHaveBeenCalledWith(component.charsRemaining);
    });
  });

  describe('charactersExceeded', () => {
    it('should call service with charsRemaining', () => {
      spyOn(characterCountService, 'charactersExceeded');
      component.charsRemaining = 1;
      component.charactersExceeded();

      expect(characterCountService.charactersExceeded).toHaveBeenCalledWith(component.charsRemaining);
    });
  });
});
