import { BikeCategoryTypeComponent } from '@components/common/bike-category-type/bike-category-type';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule, UntypedFormGroup, Validators,
} from '@angular/forms';
import { BikeCategoryDetailProvider } from '@providers/bike-category-detail/bike-category-detail';
import * as waitingRoomToCarActions from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { provideMockStore } from '@ngrx/store/testing';

describe('BikeCategoryTypeComponent', () => {
  let fixture: ComponentFixture<BikeCategoryTypeComponent>;
  let component: BikeCategoryTypeComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        BikeCategoryDetailProvider,
        provideMockStore({ ...{} }),

      ],
    });

    fixture = TestBed.createComponent(BikeCategoryTypeComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('validateCategorySelection', () => {
    it('should return null if categoryConfirmed is true', () => {
      component.categoryConfirmed = true;
      expect(component.validateCategorySelection()).toBe(null);
    });
    it('should return {categoryTypeSelectCategory: false} if categoryConfirmed is false', () => {
      component.categoryConfirmed = false;
      expect(component.validateCategorySelection()).toEqual({ categoryTypeSelectCategory: false });
    });
  });

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });

  describe('getBikeImage', () => {
    it('should return the image associated with the category passed in', () => {
      expect(component.getBikeImage('EUAM1')).toBe('assets/imgs/bike-category-icons/A.png');
    });
  });
  describe('getBikeDisplayName', () => {
    it('should return the name associated with the category passed in', () => {
      expect(component.getBikeDisplayName('EUAM1')).toBe('Motorcycle');
    });
  });

  describe('bikeCategoryModalShown', () => {
    it('should dispatch waitingRoomToCarActions.WaitingRoomToCarViewBikeCategoryModal', () => {
      spyOn(component.store$, 'dispatch');
      component.bikeCategoryModalShown();

      expect(component.store$.dispatch)
        .toHaveBeenCalledWith(waitingRoomToCarActions.WaitingRoomToCarViewBikeCategoryModal());
    });
  });

  describe('categoryCodeChanged', () => {
    it('should emit categoryCodeChange with the category passed in', () => {
      spyOn(component.categoryCodeChange, 'emit');
      component.categoryCodeChanged('B');

      expect(component.categoryCodeChange.emit)
        .toHaveBeenCalledWith('B');
    });

    it('should not emit categoryCodeChange with the category no passed in', () => {
      spyOn(component.categoryCodeChange, 'emit');
      component.categoryCodeChanged(undefined);

      expect(component.categoryCodeChange.emit)
        .not.toHaveBeenCalled();
    });
  });
});
