import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { CharacterCountService } from '@providers/character-count/character-count.service';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { AppModule } from 'src/app/app.module';
import { CandidateDescriptionComponent } from '../candidate-description';

describe('CandidateDescriptionComponent', () => {
  let characterCountService: CharacterCountService;
  let fixture: ComponentFixture<CandidateDescriptionComponent>;
  let component: CandidateDescriptionComponent;
  let behaviourMapProvider: OutcomeBehaviourMapProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateDescriptionComponent],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
        { provide: CharacterCountService, useClass: CharacterCountService },
      ],
    });

    fixture = TestBed.createComponent(CandidateDescriptionComponent);
    characterCountService = TestBed.inject(CharacterCountService);
    behaviourMapProvider = TestBed.inject(OutcomeBehaviourMapProvider);
    behaviourMapProvider.setBehaviourMap(behaviourMap);
    component = fixture.componentInstance;
  }));

  describe('invalid', () => {
    it('should return true if the formControl is invalid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeTruthy();
    });
    it('should return false if the formControl is valid and dirty', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsDirty();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is invalid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(null);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
    });
    it('should return false if the formControl is valid and clean', () => {
      component.formControl = null;
      component.formGroup = new UntypedFormGroup({});
      component.ngOnChanges();
      component.formControl.setValidators([Validators.required]);

      component.formControl.setValue(1);
      component.formControl.markAsPristine();

      expect(component.invalid).toBeFalsy();
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

  describe('candidateDescriptionChanged', () => {
    it('should emit candidate description', () => {
      spyOn(component.candidateDescriptionChange, 'emit');
      const candidateDescription = 'this is the candidate description';
      component.candidateDescriptionChanged(candidateDescription);
      expect(component.candidateDescriptionChange.emit).toHaveBeenCalledWith(candidateDescription);
    });
  });
});
