import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from 'ng-mocks';
import { AppModule } from '@app/app.module';
import { UntypedFormGroup } from '@angular/forms';
import { QuestionDelExRadioCardComponent } from '../question-del-ex-radio-card';
import { QuestionTitleComponent } from '../../question-title/question-title';

describe('QuestionDelExRadioCardComponent', () => {
  let fixture: ComponentFixture<QuestionDelExRadioCardComponent>;
  let component: QuestionDelExRadioCardComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        QuestionDelExRadioCardComponent,
        MockComponent(QuestionTitleComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(QuestionDelExRadioCardComponent);
    component = fixture.componentInstance;
  }));

  describe('ngOnChanges', () => {
    it('should create formControl if there is not one', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.question = { score: 0 };
      component.ngOnChanges();

      expect(component.formControl).toBeTruthy();
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.question = { score: 0 };
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.question = { score: 0 };
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.question = { score: 0 };
      component.ngOnChanges();

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.question = { score: 0 };
      component.ngOnChanges();

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });

  describe('questionScoreChanged', () => {
    it('should emit a numeric answer along with the question number', () => {
      spyOn(component.questionScore, 'emit');
      component.questionNumber = 1;
      component.questionScoreChanged(5);

      expect(component.questionScore.emit).toHaveBeenCalledWith({
        questionNumber: 1,
        score: 5,
      });
    });
  });
});
