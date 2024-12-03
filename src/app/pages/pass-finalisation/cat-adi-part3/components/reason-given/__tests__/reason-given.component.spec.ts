import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { AppModule } from '@app/app.module';
import { IonicModule } from '@ionic/angular';
import { CharacterCountService } from '@providers/character-count/character-count.service';
import { ReasonGivenComponent } from '../reason-given.component';

describe('ReasonGivenComponent', () => {
  let characterCountService: CharacterCountService;
  let component: ReasonGivenComponent;
  let fixture: ComponentFixture<ReasonGivenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ReasonGivenComponent],
      imports: [IonicModule, AppModule, ReactiveFormsModule],
      providers: [{ provide: CharacterCountService, useClass: CharacterCountService }],
    });

    fixture = TestBed.createComponent(ReasonGivenComponent);
    characterCountService = TestBed.inject(CharacterCountService);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('characterCountChanged', () => {
    it('should edit the variable to the value parsed into the function', () => {
      component.formControl = new FormControl();
      component.characterCountChanged(1);
      expect(component.charsRemaining).toEqual(1);
    });
    it('should check the validity of the form control', () => {
      component.formControl = new FormControl();
      spyOn(component.formControl, 'updateValueAndValidity');
      component.characterCountChanged(1);
      expect(component.formControl.updateValueAndValidity).toHaveBeenCalled();
    });
  });

  describe('charactersExceeded', () => {
    it('should call service with charsRemaining', () => {
      spyOn(characterCountService, 'charactersExceeded');
      component.charsRemaining = 1;
      component.charactersExceeded();

      expect(characterCountService.charactersExceeded).toHaveBeenCalledWith(component.charsRemaining);
    });
  });

  describe('getCharacterCountText', () => {
    it('should call service with charsRemaining', () => {
      spyOn(characterCountService, 'getCharacterCountText');
      component.charsRemaining = 1;
      component.getCharacterCountText();

      expect(characterCountService.getCharacterCountText).toHaveBeenCalledWith(component.charsRemaining);
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
