import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdditionalInformationComponent } from '@pages/office/components/additional-information/additional-information';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

describe('AdditionalInformationComponent', () => {
  let fixture: ComponentFixture<AdditionalInformationComponent>;
  let component: AdditionalInformationComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdditionalInformationComponent,
      ],
    });

    fixture = TestBed.createComponent(AdditionalInformationComponent);
    component = fixture.componentInstance;
  }));

  describe('ngOnChanges', () => {
    it('should create formControl if there is not one', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();

      expect(component.formControl).toBeTruthy();
    });
    it('should patch additionalInformation into formControl', () => {
      component.formGroup = new UntypedFormGroup({});
      component.formControl = new UntypedFormControl(null);
      component.additionalInformation = 'test';
      component.formGroup.addControl(AdditionalInformationComponent.fieldName, component.formControl);
      component.ngOnChanges();

      expect(component.formControl.value).toBe('test');
    });
  });

  describe('newEmailRadioSelected', () => {
    it('should emit newEmailRadioSelect with correct parameters', () => {
      spyOn(component.additionalInformationChange, 'emit');
      component.additionalInformationChanged('test');
      expect(component.additionalInformationChange.emit).toHaveBeenCalledWith('test');
    });
  });
});
