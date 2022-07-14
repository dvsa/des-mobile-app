import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';
import { AppModule } from '@app/app.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { FurtherDevelopmentComponent } from '../further-development.component';

describe('FurtherDevelopmentComponent', () => {
  let component: FurtherDevelopmentComponent;
  let fixture: ComponentFixture<FurtherDevelopmentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [
        FurtherDevelopmentComponent,
        MockComponent(WarningBannerComponent),
      ],
      imports: [
        IonicModule,
        AppModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(FurtherDevelopmentComponent);
    component = fixture.componentInstance;
  }));

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

});
