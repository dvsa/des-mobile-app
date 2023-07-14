import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AppModule } from '@app/app.module';
import {
  AlternativeMotEvidenceDetails,
} from '@pages/waiting-room-to-car/components/alternative-mot-evidence-details/alternative-mot-evidence-details';

describe('AlternativeMotEvidenceDetails', () => {
  let fixture: ComponentFixture<AlternativeMotEvidenceDetails>;
  let component: AlternativeMotEvidenceDetails;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AlternativeMotEvidenceDetails,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });

    fixture = TestBed.createComponent(AlternativeMotEvidenceDetails);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('ngOnChanges', () => {
    it('should have accompaniment form control be added to '
      + 'form if there is no form control already there', () => {
      component.alternativeMotEvidenceDetails = 'some detail';
      component.ngOnChanges();
      expect(component.formGroup.contains('alternativeMotEvidenceDetails'))
        .toEqual(true);
      expect(component.formGroup.get('alternativeMotEvidenceDetails')?.value)
        .toEqual('some detail');
    });
  });

  describe('alternativeMotEvidenceDetailsChanged', () => {
    beforeEach(() => {
      spyOn(component.alternativeMotEvidenceDetailsChange, 'emit');
    });
    it('should emit when formControl is valid', () => {
      component.alternativeMotEvidenceProvided = true;
      component.alternativeMotEvidenceDetails = 'some detail';
      component.ngOnChanges();
      component.alternativeMotEvidenceDetailsChanged('details');
      expect(component.alternativeMotEvidenceDetailsChange.emit)
        .toHaveBeenCalled();
    });
    it('should not emit when formControl is invalid', () => {
      component.alternativeMotEvidenceProvided = true;
      component.alternativeMotEvidenceDetails = null;
      component.ngOnChanges();
      component.alternativeMotEvidenceDetailsChanged('details');
      expect(component.alternativeMotEvidenceDetailsChange.emit)
        .not
        .toHaveBeenCalled();
    });
  });

});
