import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { FormGroup } from '@angular/forms';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { IonicModule } from '@ionic/angular';
import { D255Component, ValidD255Values } from '../d255';

describe('D255Component', () => {
  let fixture: ComponentFixture<D255Component>;
  let component: D255Component;
  let outcomeBehaviourMapProvider: OutcomeBehaviourMapProvider;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [D255Component],
      imports: [IonicModule],
      providers: [OutcomeBehaviourMapProvider],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(D255Component);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    outcomeBehaviourMapProvider = TestBed.inject(OutcomeBehaviourMapProvider);
  }));

  describe('Class', () => {
    describe('ngOnChanges', () => {
      it('should add a form control for D255 with a validator if the field should be visible', () => {
        spyOn(outcomeBehaviourMapProvider, 'getVisibilityType').and.returnValue(VisibilityType.Visible);
        component.ngOnChanges();
        expect(component.formGroup.get(D255Component.fieldName)).not.toBeNull();
        expect(component.formGroup.get(D255Component.fieldName).validator).not.toBeNull();
      });
      it('should add a form control for D255 with no validator if the field should be hidden', () => {
        spyOn(outcomeBehaviourMapProvider, 'getVisibilityType').and.returnValue(VisibilityType.NotVisible);
        component.ngOnChanges();
        expect(component.formGroup.get(D255Component.fieldName)).not.toBeNull();
        expect(component.formGroup.get(D255Component.fieldName).validator).toBeNull();
      });
    });
  });
  describe('d255Changed', () => {
    it('should emit a event with the correct value if the form control is valid', () => {
      spyOn(component.d255Change, 'emit');
      component.ngOnChanges();
      component.d255Changed(ValidD255Values.YES);
      expect(component.d255Change.emit).toHaveBeenCalledWith(true);

    });
    it('should not emit an event if the form control is not valid', () => {
      spyOn(outcomeBehaviourMapProvider, 'getVisibilityType').and.returnValue(VisibilityType.Visible);
      spyOn(component.d255Change, 'emit');
      component.ngOnChanges();
      component.formGroup.get(D255Component.fieldName).setErrors({ incorrect: true });
      component.d255Changed(ValidD255Values.YES);
      expect(component.d255Change.emit).not.toHaveBeenCalled();
    });
  });
  describe('getD255OrDefault', () => {
    it('should return YES if D255 is set to true', () => {
      component.d255 = true;
      fixture.detectChanges();
      expect(component.getD255OrDefault()).toEqual(ValidD255Values.YES);
    });
    it('should return NO if D255 is set to false', () => {
      component.d255 = false;
      fixture.detectChanges();
      expect(component.getD255OrDefault()).toEqual(ValidD255Values.NO);
    });
    it('should set the default value for the field if one exists and not other value has been set', () => {
      component.d255 = null;
      spyOn(outcomeBehaviourMapProvider, 'hasDefault').and.returnValue(true);
      spyOn(outcomeBehaviourMapProvider, 'getDefault').and.returnValue(ValidD255Values.YES);
      spyOn(component, 'd255Changed');
      fixture.detectChanges();
      expect(component.getD255OrDefault()).toEqual(ValidD255Values.YES);
      expect(outcomeBehaviourMapProvider.hasDefault).toHaveBeenCalled();
      expect(outcomeBehaviourMapProvider.getDefault).toHaveBeenCalled();
      expect(component.d255Changed).toHaveBeenCalledWith(ValidD255Values.YES);
    });
    it('should return null if there is no default value and the value has not been set', () => {
      component.d255 = null;
      spyOn(outcomeBehaviourMapProvider, 'hasDefault').and.returnValue(false);
      fixture.detectChanges();
      expect(component.getD255OrDefault()).toBeNull();
    });
  });
});
