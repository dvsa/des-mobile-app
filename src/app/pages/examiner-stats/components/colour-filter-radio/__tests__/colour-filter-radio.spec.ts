import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { UntypedFormGroup } from '@angular/forms';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { ColourFilterRadioComponent } from '@pages/examiner-stats/components/colour-filter-radio/colour-filter-radio';
import { ColourEnum } from '@pages/examiner-stats/examiner-stats.page';

describe('ColourFilterRadioComponent', () => {
  let fixture: ComponentFixture<ColourFilterRadioComponent>;
  let component: ColourFilterRadioComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ColourFilterRadioComponent],
      imports: [
        IonicModule,
      ],
      providers: [
        provideMockStore({ ...{} }),
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(ColourFilterRadioComponent);
    component = fixture.componentInstance;
  }));

  describe('viewFilterChanged', () => {
    it('should emit identification while from control is valid', () => {
      spyOn(component.filterChange, 'emit');
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      component.formControl.setValue(1);

      component.viewFilterChanged(ColourEnum.Default);
      expect(component.filterChange.emit).toHaveBeenCalledWith(ColourEnum.Default);
    });
  });
});
