import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AppModule } from '@app/app.module';
import {
  AlternativeMotEvidence,
} from '@pages/waiting-room-to-car/components/alternative-mot-evidence/alternative-mot-evidence';

describe('AlternativeMotEvidence', () => {
  let fixture: ComponentFixture<AlternativeMotEvidence>;
  let component: AlternativeMotEvidence;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlternativeMotEvidence,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });

    fixture = TestBed.createComponent(AlternativeMotEvidence);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('ngOnChanges', () => {
    it('should have accompaniment form control be added to '
      + 'form if there is no form control already there', () => {
      component.alternativeMotEvidence = true;
      component.ngOnChanges();
      expect(component.formGroup.contains('alternativeMotEvidence'))
        .toEqual(true);
      expect(component.formGroup.get('alternativeMotEvidence')?.value)
        .toEqual(true);
    });
  });

  describe('alternativeMotEvidenceChanged', () => {
    beforeEach(() => {
      spyOn(component.alternativeMotEvidenceChange, 'emit');
    });
    it('should emit when formControl is valid', () => {
      component.alternativeMotEvidence = true;
      component.ngOnChanges();
      component.alternativeMotEvidenceChanged('details');
      expect(component.alternativeMotEvidenceChange.emit)
        .toHaveBeenCalled();
    });
    it('should not emit when formControl is invalid', () => {
      component.alternativeMotEvidence = null;
      component.ngOnChanges();
      component.alternativeMotEvidenceChanged('details');
      expect(component.alternativeMotEvidenceChange.emit)
        .not
        .toHaveBeenCalled();
    });
  });

});
