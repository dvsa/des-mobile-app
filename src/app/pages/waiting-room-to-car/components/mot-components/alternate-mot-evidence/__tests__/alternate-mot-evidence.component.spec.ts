import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AlternateMotEvidenceComponent } from '../alternate-mot-evidence.component';

describe('AlternateMotEvidenceComponent', () => {
  let component: AlternateMotEvidenceComponent;
  let fixture: ComponentFixture<AlternateMotEvidenceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AlternateMotEvidenceComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(AlternateMotEvidenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('setupControl', () => {
    it('should setup the alternateEvidenceCtrl '
      + 'form control if it does not already exist', () => {
      component.formGroup = new UntypedFormGroup({
        alternateEvidenceCtrl: new UntypedFormControl(),
      });
      component.formControl = new UntypedFormControl();
      component.setupControl();
      expect(component.formGroup.contains('alternateEvidenceCtrl')).toBeTruthy();
    });
  });
});
