import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { UntypedFormGroup } from '@angular/forms';
import { OutcomeBehaviourMapProvider, VisibilityType } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { IonicModule } from '@ionic/angular';
import { D255Component } from '../d255';

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
    component.formGroup = new UntypedFormGroup({});
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

    describe('d255Changed', () => {
      it('should emit a event with the correct value if the form control is valid', () => {
        spyOn(component.d255Change, 'emit');
        component.ngOnChanges();
        component.d255Changed('d255-yes');
        expect(component.d255Change.emit).toHaveBeenCalledWith(true);
      });
      it('should emit a event with the correct value if the form control is valid', () => {
        spyOn(component.d255Change, 'emit');
        component.ngOnChanges();
        component.d255Changed('d255-no');
        expect(component.d255Change.emit).toHaveBeenCalledWith(false);
      });
    });

    describe('getD255OrDefault', () => {
      it('should return true if D255 is set to true', () => {
        component.d255 = true;
        expect(component.getD255OrDefault()).toEqual(true);
      });
      it('should return false if D255 is set to false and eyesight is set to false', () => {
        component.d255 = false;
        component.eyesightTestFailed = false;
        expect(component.getD255OrDefault()).toEqual(false);
      });
      it('should return false if D255 is set to false and eyesight is set to true', () => {
        component.d255 = false;
        component.eyesightTestFailed = true;
        expect(component.getD255OrDefault()).toEqual(false);
      });
      it('should return true if D255 is set to null and eyesight is set to true', () => {
        component.d255 = null;
        component.eyesightTestFailed = true;
        expect(component.getD255OrDefault()).toEqual(true);
      });
    });
  });
});
