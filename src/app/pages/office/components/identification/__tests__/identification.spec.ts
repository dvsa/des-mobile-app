import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { IdentificationComponent } from '@pages/office/components/identification/identification';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

describe('IdentificationComponent', () => {
  let fixture: ComponentFixture<IdentificationComponent>;
  let component: IdentificationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(IdentificationComponent);
    component = fixture.componentInstance;
  }));

  describe('identificationChanged', () => {
    it('should emit identification while from control is valid', () => {
      spyOn(component.identificationChange, 'emit');
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.identificationChanged('Licence');
      expect(component.identificationChange.emit).toHaveBeenCalledWith('Licence');
    });
    it('should not emit identification while from control is not valid', () => {
      spyOn(component.identificationChange, 'emit');
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.identificationChanged('Licence');
      expect(component.identificationChange.emit).not.toHaveBeenCalled();
    });
  });
});
