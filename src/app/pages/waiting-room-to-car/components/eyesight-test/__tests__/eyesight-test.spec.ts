import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { EyesightTestComponent } from '../eyesight-test';
import { AppModule } from '../../../../../app.module';

describe('EyesightTestComponent', () => {
  let fixture: ComponentFixture<EyesightTestComponent>;
  let component: EyesightTestComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        EyesightTestComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(EyesightTestComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
  }));

  describe('DOM', () => {
    it('should call EyesightResultChanged with P when Pass is pressed', () => {
      spyOn(component, 'eyesightTestResultChanged');
      component.ngOnChanges();
      const passEyesightRadio = fixture.debugElement.query(By.css('#eyesight-pass'));
      passEyesightRadio.triggerEventHandler('change', { target: { value: 'P' } });
      fixture.detectChanges();
      expect(component.eyesightTestResultChanged).toHaveBeenCalledWith('P');
    });
    it('should call EyesightResultChanged with F when Fail is pressed', () => {
      spyOn(component, 'eyesightTestResultChanged');
      component.ngOnChanges();
      const passEyesightRadio = fixture.debugElement.query(By.css('#eyesight-fail'));
      passEyesightRadio.triggerEventHandler('change', { target: { value: 'F' } });
      fixture.detectChanges();
      expect(component.eyesightTestResultChanged).toHaveBeenCalledWith('F');
    });
  });
});
