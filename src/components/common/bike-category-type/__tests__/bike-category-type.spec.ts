import { BikeCategoryTypeComponent } from '@components/common/bike-category-type/bike-category-type';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  ReactiveFormsModule, UntypedFormGroup, Validators,
} from '@angular/forms';
import * as waitingRoomToCarActions from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { provideMockStore } from '@ngrx/store/testing';
import { BikeCategoryDetail, BikeTestType } from '@providers/bike-category-detail/bike-category-detail.model';
import { BikeCategoryDetailProvider } from '@providers/bike-category-detail/bike-category-detail';
import { BikeCategoryDetailProviderMock } from '@providers/bike-category-detail/__tests__/bike-category-detail.mock';

describe('BikeCategoryTypeComponent', () => {
  let fixture: ComponentFixture<BikeCategoryTypeComponent>;
  let component: BikeCategoryTypeComponent;
  let bikeCategoryDetailProvider: BikeCategoryDetailProvider;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: BikeCategoryDetailProvider, useClass: BikeCategoryDetailProviderMock },
        provideMockStore({ ...{} }),
      ],
    });

    fixture = TestBed.createComponent(BikeCategoryTypeComponent);
    bikeCategoryDetailProvider = TestBed.inject(BikeCategoryDetailProvider);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.selectRef = jasmine.createSpyObj('IonSelect', ['open']);
  }))
  ;

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
    it('should return the imageUrl of the response from getDetailByCategoryCode', () => {
      expect(component.getBikeImage('EUAM1')).toBe('testUrl');
    });
  });
  describe('getBikeDisplayName', () => {
    it('should return the name of the response from getDetailByCategoryCode', () => {
      expect(component.getBikeDisplayName('EUAM1')).toBe('testName');
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

  describe('ngOnInit', () => {
    it('should default to MOD1 if testType is not MOD1 or MOD2', () => {
      component.testType = 'Test' as BikeTestType;
      component.ngOnInit();
      expect(component.testType).toBe(BikeTestType.MOD1);
    });

    it('should set testType to MOD1 if input testType is MOD1', () => {
      component.testType = BikeTestType.MOD1;
      component.ngOnInit();
      expect(component.testType).toBe(BikeTestType.MOD1);
    });

    it('should set testType to MOD2 if input testType is MOD2', () => {
      component.testType = BikeTestType.MOD2;
      component.ngOnInit();
      expect(component.testType).toBe(BikeTestType.MOD2);
    });

    it('should populate bikeCategoryDetails based on MOD1 test type', () => {
      spyOn(bikeCategoryDetailProvider, 'getAllDetailsByTestType').and.returnValue([{
        categoryCode: 'A1',
        displayName: 'A1',
        imageUrl: 'url',
      } as BikeCategoryDetail]);
      component.testType = BikeTestType.MOD1;
      component.ngOnInit();
      expect(component.bikeCategoryDetails.length).toBeGreaterThan(0);
      expect(component.bikeCategoryDetails[0].categoryCode).toBe('A1');
    });

    it('should populate bikeCategoryDetails based on MOD2 test type', () => {
      spyOn(bikeCategoryDetailProvider, 'getAllDetailsByTestType').and.returnValue([{
        categoryCode: 'A2',
        displayName: 'A2',
        imageUrl: 'url',
      } as BikeCategoryDetail]);
      component.testType = BikeTestType.MOD2;
      component.ngOnInit();
      expect(component.bikeCategoryDetails.length).toBeGreaterThan(0);
      expect(component.bikeCategoryDetails[0].categoryCode).toBe('A2');
    });
  });

  describe('openCategorySelector', () => {

    it('should call loadImages before opening the category selector', async () => {
      spyOn(component, 'loadImages');
      await component.openCategorySelector();
      expect(component.loadImages).toHaveBeenCalled();
    });

    it('should open the category selector', async () => {
      await component.openCategorySelector();
      spyOn(component.selectRef, 'open');
      expect(component.selectRef.open).toHaveBeenCalled();
    });
  });
});
