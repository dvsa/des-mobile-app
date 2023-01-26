import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AppModule } from 'src/app/app.module';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { behaviourMap } from '@pages/office/office-behaviour-map';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { CandidateDescriptionComponent } from '../candidate-description';

describe('CandidateDescriptionComponent', () => {
  let fixture: ComponentFixture<CandidateDescriptionComponent>;
  let component: CandidateDescriptionComponent;
  let behaviourMapProvider: OutcomeBehaviourMapProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CandidateDescriptionComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: OutcomeBehaviourMapProvider, useClass: OutcomeBehaviourMapProvider },
      ],
    });

    fixture = TestBed.createComponent(CandidateDescriptionComponent);
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
    it('should display "You have 1 character remaining" when only 1 is remaining', () => {
      component.candidateDescriptionCharsRemaining = 1;

      expect(component.getCharacterCountText()).toBe('You have 1 character remaining');
    });
    it('should display "You have 2 characters remaining" when only 1 is remaining', () => {
      component.candidateDescriptionCharsRemaining = 2;

      expect(component.getCharacterCountText()).toBe('You have 2 characters remaining');
    });
    it('should display "You have 1 character too many" when there is 1 over the limit', () => {
      component.candidateDescriptionCharsRemaining = -1;

      expect(component.getCharacterCountText()).toBe('You have 1 character too many');
    });
    it('should display "You have 2 characters too many" when there is 2 over the limit', () => {
      component.candidateDescriptionCharsRemaining = -2;

      expect(component.getCharacterCountText()).toBe('You have 2 characters too many');
    });
  });

  describe('characterCountChanged', () => {
    it('should edit the variable to the value parsed into the function', () => {
      component.characterCountChanged(1);
      expect(component.candidateDescriptionCharsRemaining)
        .toEqual(1);
    });
  });

  describe('charactersExceeded', () => {
    it('should return true if noAdviceCharsRemaining is less than 0 ', () => {
      component.candidateDescriptionCharsRemaining = -100;
      expect(component.charactersExceeded())
        .toEqual(true);
    });
    it('should return false if noAdviceCharsRemaining is more than 0 ', () => {
      component.candidateDescriptionCharsRemaining = 100;
      expect(component.charactersExceeded())
        .toEqual(false);
    });
  });

  describe('class', () => {
    it('should emit candidate description', () => {
      spyOn(component.candidateDescriptionChange, 'emit');
      const candidateDescription = 'this is the candidate description';
      component.candidateDescriptionChanged(candidateDescription);
      expect(component.candidateDescriptionChange.emit).toHaveBeenCalledWith(candidateDescription);
    });
  });
});
