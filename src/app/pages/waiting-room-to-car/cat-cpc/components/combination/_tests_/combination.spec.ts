import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';

import { AppModule } from '@app/app.module';
import { CombinationComponent } from '../combination';

describe('CombinationComponent', () => {
  let fixture: ComponentFixture<CombinationComponent>;
  let component: CombinationComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        CombinationComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CombinationComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formControl = new FormControl(null, [Validators.required]);
  }));

  describe('ngOnChanges', () => {
    it('should have fieldName form control be added to '
            + 'form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls[CombinationComponent.fieldName])
        .toBeTruthy();
    });
    it('should patch control with value stored in combination ', () => {
      component.combination = 'test';

      component.ngOnChanges();
      expect(component.formControl.value)
        .toEqual('test');
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid)
        .toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid)
        .toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid)
        .toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid)
        .toBeFalsy();
    });
  });

  describe('combinationChanged', () => {
    it('should emit the value passed into the function', () => {
      spyOn(component.combinationChange, 'emit');
      component.combinationChanged('LGV1');
      expect(component.combinationChange.emit)
        .toHaveBeenCalledWith('LGV1');
    });
  });
});
