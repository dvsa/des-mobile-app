import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';
import { UntypedFormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReasonGivenComponent } from '../reason-given.component';

describe('ReasonGivenComponent', () => {
  let component: ReasonGivenComponent;
  let fixture: ComponentFixture<ReasonGivenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReasonGivenComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });

    fixture = TestBed.createComponent(ReasonGivenComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('characterCountChanged', () => {
    it('should edit the variable to the value parsed into the function', () => {
      component.characterCountChanged(1);
      expect(component.noAdviceCharsRemaining)
        .toEqual(1);
    });
  });

  describe('charactersExceeded', () => {
    it('should return true if noAdviceCharsRemaining is less than 0 ', () => {
      component.noAdviceCharsRemaining = -100;
      expect(component.charactersExceeded())
        .toEqual(true);
    });
    it('should return false if noAdviceCharsRemaining is more than 0 ', () => {
      component.noAdviceCharsRemaining = 100;
      expect(component.charactersExceeded())
        .toEqual(false);
    });
  });

  describe('getCharacterCountText', () => {
    it('should return a string containing the amount of letters remaining '
        + 'based off the number of letters in noAdviceCharsRemaining, the sentence should include '
        + 'the plural of character as there are more than one remaining', () => {
      component.noAdviceCharsRemaining = 850;
      expect(component.getCharacterCountText())
        .toEqual('You have 850 characters remaining');
    });
    it('should return a string containing the amount of letters remaining '
        + 'based off the number of letters in noAdviceCharsRemaining, the sentence should include '
        + 'the singular of character as there is one remaining', () => {
      component.noAdviceCharsRemaining = 1;
      expect(component.getCharacterCountText())
        .toEqual('You have 1 character remaining');
    });
    it('should return a string containing the amount of letters remaining '
        + 'based off the number of letters in noAdviceCharsRemaining, the sentence should state '
        + 'that there are too many characters', () => {
      component.noAdviceCharsRemaining = -100;
      expect(component.getCharacterCountText())
        .toEqual('You have 100 characters too many');
    });
    it('should return a string containing the amount of letters remaining '
        + 'based off the number of letters in noAdviceCharsRemaining, the sentence should state '
        + 'that there is 1 too many characters', () => {
      component.noAdviceCharsRemaining = -1;
      expect(component.getCharacterCountText())
        .toEqual('You have 1 character too many');
    });
  });

  describe('adviceReasonChange', () => {
    it('should emit text', () => {
      spyOn(component.adviceReason, 'emit');
      const text = 'this is test text';
      component.adviceReasonChange(text);
      expect(component.adviceReason.emit).toHaveBeenCalledWith(text);
    });
  });
  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.ngOnChanges();
      component.formGroup.get(ReasonGivenComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.ngOnChanges();
      component.formGroup.get(ReasonGivenComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.ngOnChanges();
      component.formGroup.get(ReasonGivenComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.ngOnChanges();
      component.formGroup.get(ReasonGivenComponent.fieldName).setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
  });
});
