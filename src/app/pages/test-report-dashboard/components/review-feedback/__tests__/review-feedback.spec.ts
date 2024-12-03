import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, UntypedFormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReviewFeedback } from '@pages/test-report-dashboard/components/review-feedback/review-feedback';
import { CharacterCountService } from '@providers/character-count/character-count.service';

describe('ReviewFeedback', () => {
  let characterCountService: CharacterCountService;
  let fixture: ComponentFixture<ReviewFeedback>;
  let component: ReviewFeedback;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewFeedback],
      imports: [IonicModule],
      providers: [{ provide: CharacterCountService, useClass: CharacterCountService }],
    });

    fixture = TestBed.createComponent(ReviewFeedback);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({});
    characterCountService = TestBed.inject(CharacterCountService);
  }));

  describe('feedbackChanged', () => {
    it('should emit getCharacterCountText with correct parameters', () => {
      spyOn(component.feedbackChange, 'emit');
      component.feedbackChanged('feedback');
      expect(component.feedbackChange.emit).toHaveBeenCalledWith('feedback');
    });
  });

  describe('getCharacterCountText', () => {
    it('should call service with charsRemaining', () => {
      spyOn(characterCountService, 'getCharacterCountText')
      component.charsRemaining = 1;
      component.getCharacterCountText()

      expect(characterCountService.getCharacterCountText).toHaveBeenCalledWith(component.charsRemaining);
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
