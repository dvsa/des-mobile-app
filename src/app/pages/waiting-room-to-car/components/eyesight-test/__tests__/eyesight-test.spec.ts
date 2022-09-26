import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { By } from '@angular/platform-browser';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { EyesightTestComponent } from '../eyesight-test';

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
      expect(component.eyesightTestResultChanged)
        .toHaveBeenCalledWith('P');
    });
    it('should call EyesightResultChanged with F when Fail is pressed', () => {
      spyOn(component, 'eyesightTestResultChanged');
      component.ngOnChanges();
      const passEyesightRadio = fixture.debugElement.query(By.css('#eyesight-fail'));
      passEyesightRadio.triggerEventHandler('change', { target: { value: 'F' } });
      fixture.detectChanges();
      expect(component.eyesightTestResultChanged)
        .toHaveBeenCalledWith('F');
    });
  });
  describe('testPassed', () => {
    it('should return true if eyesightPassRadioChecked is true', () => {
      component.eyesightPassRadioChecked = true;
      expect(component.testPassed)
        .toBeTruthy();
    });
    it('should return false if eyesightPassRadioChecked is false', () => {
      component.eyesightPassRadioChecked = false;
      expect(component.testPassed)
        .toBeFalsy();
    });
  });
  describe('testFailed', () => {
    it('should return true if eyesightFailRadioChecked is true', () => {
      component.eyesightFailRadioChecked = true;
      expect(component.testFailed)
        .toBeTruthy();
    });
    it('should return false if eyesightFailRadioChecked is false', () => {
      component.eyesightFailRadioChecked = false;
      expect(component.testFailed)
        .toBeFalsy();
    });
  });
  describe('eyesightTestResultChanged', () => {
    it('should emit true if result is set to P and formControl is valid', () => {
      component.formControl = new FormControl(null, [Validators.required]);
      component.formControl.setValue(true);
      spyOn(component.eyesightTestResultChange, 'emit');

      component.eyesightTestResultChanged('P');

      expect(component.eyesightTestResultChange.emit)
        .toHaveBeenCalledWith(true);
    });
  });
  describe('ngOnChanges', () => {
    it('should patch formControl with P if eyesightPassRadioChecked is true and'
            + 'eyesightFailRadioChecked is false', () => {
      component.eyesightPassRadioChecked = true;
      component.eyesightFailRadioChecked = false;
      component.ngOnChanges();
      expect(component.formControl.value)
        .toBe('P');
    });
    it('should patch formControl with P if eyesightPassRadioChecked is true and'
            + 'eyesightFailRadioChecked is true', () => {
      component.eyesightPassRadioChecked = true;
      component.eyesightFailRadioChecked = true;
      component.ngOnChanges();
      expect(component.formControl.value)
        .toBe('P');
    });
    it('should patch formControl with f if eyesightPassRadioChecked is false and'
            + 'eyesightFailRadioChecked is true', () => {
      component.eyesightPassRadioChecked = false;
      component.eyesightFailRadioChecked = true;
      component.ngOnChanges();
      expect(component.formControl.value)
        .toBe('F');
    });
  });
});
