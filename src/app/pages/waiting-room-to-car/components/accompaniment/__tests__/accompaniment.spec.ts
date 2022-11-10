import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  UntypedFormControl, UntypedFormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AppModule } from '@app/app.module';

describe('AccompanimentComponent', () => {
  let fixture: ComponentFixture<AccompanimentComponent>;
  let component: AccompanimentComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AccompanimentComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
        PipesModule,
      ],
    });

    fixture = TestBed.createComponent(AccompanimentComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formControl = new UntypedFormControl(null, [Validators.required]);
  }));

  describe('ngOnChanges', () => {
    it('should have accompaniment form control be added to '
            + 'form if there is no form control already there', () => {
      component.formControl = null;
      component.ngOnChanges();

      expect(component.formGroup.controls[`accompaniment-${component.accompanimentType}`])
        .toBeTruthy();
    });
  });

  describe('accompanimentChanged', () => {
    it('should emit when formControl is valid', () => {
      component.formControl = new UntypedFormControl(1);
      spyOn(component.accompanimentChange, 'emit');
      component.accompanimentChanged();
      expect(component.accompanimentChange.emit)
        .toHaveBeenCalled();
    });
    it('should not emit when formControl is invalid', () => {
      component.formControl.setValue(null);
      spyOn(component.accompanimentChange, 'emit');
      component.accompanimentChanged();
      expect(component.accompanimentChange.emit)
        .not
        .toHaveBeenCalled();
    });
  });

});
