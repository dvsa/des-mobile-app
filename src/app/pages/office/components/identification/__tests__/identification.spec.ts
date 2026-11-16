import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideMockStore } from '@ngrx/store/testing';
import { IdentificationComponent } from '@pages/office/components/identification/identification';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

describe('IdentificationComponent', () => {
  let fixture: ComponentFixture<IdentificationComponent>;
  let component: IdentificationComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IdentificationComponent],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(IdentificationComponent);
    component = fixture.componentInstance;
  });

  describe('identificationChanged', () => {
    it('should emit identification while from control is valid', () => {
      vi.spyOn(component.identificationChange, 'emit').mockReturnValue(undefined);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(1);

      component.identificationChanged('Licence');
      expect(component.identificationChange.emit).toHaveBeenCalledWith('Licence');
    });
    it('should not emit identification while from control is not valid', () => {
      vi.spyOn(component.identificationChange, 'emit').mockReturnValue(undefined);
      component.formGroup = new UntypedFormGroup({});

      component.ngOnChanges();

      component.formControl.setValidators(Validators.required);
      component.formControl.setValue(null);

      component.identificationChanged('Licence');
      expect(component.identificationChange.emit).not.toHaveBeenCalled();
    });
  });
});
