import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { TellMeQuestionOutcomeComponent } from '../tell-me-question-outcome';

describe('TellMeQuestionOutcomeComponent', () => {
  let fixture: ComponentFixture<TellMeQuestionOutcomeComponent>;
  let component: TellMeQuestionOutcomeComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        TellMeQuestionOutcomeComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TellMeQuestionOutcomeComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('tellMeQuestionChanged', () => {
    it('should emit the correct event with the parameter'
        + 'given when form control is valid', () => {
      component.formControl = new FormControl(1, [Validators.required]);
      spyOn(component.tellMeQuestionOutcomeChange, 'emit');
      component.tellMeQuestionOutcomeChanged('test');
      expect(component.tellMeQuestionOutcomeChange.emit).toHaveBeenCalledWith('test');
    });
    it('should emit nothing if form control is invalid', () => {
      spyOn(component.tellMeQuestionOutcomeChange, 'emit');
      component.formControl = new FormControl(null, [Validators.required]);
      expect(component.tellMeQuestionOutcomeChange.emit).not.toHaveBeenCalled();
    });
  });

  describe('DOM', () => {
    it('should call tellMeQuestionOutcomeChanged  with P when Pass is pressed', () => {
      spyOn(component, 'tellMeQuestionOutcomeChanged');
      component.ngOnChanges();
      component.tellMeQuestionSelected = true;
      fixture.detectChanges();
      const correctRadio = fixture.debugElement.query(By.css('#tellme-correct'));
      correctRadio.triggerEventHandler('change', { target: { value: 'P' } });
      fixture.detectChanges();
      expect(component.tellMeQuestionOutcomeChanged).toHaveBeenCalledWith('P');
    });
    it('should call tellMeQuestionOutcomeChanged with DF when Fail is pressed', () => {
      spyOn(component, 'tellMeQuestionOutcomeChanged');
      component.ngOnChanges();
      component.tellMeQuestionSelected = true;
      fixture.detectChanges();
      const faultRadio = fixture.debugElement.query(By.css('#tellme-fault'));
      faultRadio.triggerEventHandler('change', { target: { value: 'DF' } });
      fixture.detectChanges();
      expect(component.tellMeQuestionOutcomeChanged).toHaveBeenCalledWith('DF');
    });
  });
});
