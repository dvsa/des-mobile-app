import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideMockStore } from '@ngrx/store/testing';
import { ColourFilterRadioComponent } from '@pages/examiner-records/components/colour-filter-radio/colour-filter-radio';
import { ColourEnum } from '@providers/examiner-records/examiner-records';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';

describe('ColourFilterRadioComponent', () => {
  let fixture: ComponentFixture<ColourFilterRadioComponent>;
  let component: ColourFilterRadioComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ColourFilterRadioComponent],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(ColourFilterRadioComponent);
    component = fixture.componentInstance;
  });

  describe('viewFilterChanged', () => {
    it('should emit identification while from control is valid', () => {
      vi.spyOn(component.filterChange, 'emit').mockReturnValue(undefined);
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);

      component.viewFilterChanged(ColourEnum.DEFAULT);
      expect(component.filterChange.emit).toHaveBeenCalledWith(ColourEnum.DEFAULT);
    });
  });
});
