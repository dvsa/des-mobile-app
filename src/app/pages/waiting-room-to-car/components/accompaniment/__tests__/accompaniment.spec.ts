import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { configureTestSuite } from 'ng-bullet';
import { AccompanimentComponent } from '@pages/waiting-room-to-car/components/accompaniment/accompaniment';
import { PipesModule } from '@shared/pipes/pipes.module';
import { AppModule } from '@app/app.module';

describe('AccompanimentComponent', () => {
  let fixture: ComponentFixture<AccompanimentComponent>;
  let component: AccompanimentComponent;

  configureTestSuite(() => {
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
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AccompanimentComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({});
    component.formControl = new FormControl(null, [Validators.required]);
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
      component.formControl = new FormControl(1);
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
