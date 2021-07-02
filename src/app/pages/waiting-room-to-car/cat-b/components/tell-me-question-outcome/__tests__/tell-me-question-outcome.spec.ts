import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { FormGroup } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { TellMeQuestionOutcomeComponent } from '../tell-me-question-outcome';
import { AppModule } from '../../../../../../app.module';

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
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(TellMeQuestionOutcomeComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

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
