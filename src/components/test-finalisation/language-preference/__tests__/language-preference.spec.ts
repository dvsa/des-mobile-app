import {
  ComponentFixture, TestBed, waitForAsync,
} from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';
import { IonicModule } from '@ionic/angular';
import { AppModule } from '@app/app.module';

describe('LanguagePreferencesComponent', () => {
  let fixture: ComponentFixture<LanguagePreferencesComponent>;
  let component: LanguagePreferencesComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LanguagePreferencesComponent,
      ],
      imports: [
        IonicModule,
        AppModule,
      ],
    });

    fixture = TestBed.createComponent(LanguagePreferencesComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
  }));

  describe('ngOnChanges', () => {
    it('should add the form control for the language preference radio', () => {
      component.ngOnChanges();
      expect(component.formGroup.get('languagePreferences')).not.toBeNull();
    });
    it('should set the value of the validation to true if isWelsh is true', () => {
      component.isWelsh = true;
      component.ngOnChanges();
      expect(component.formGroup.get('languagePreferences').value).toEqual('true');
    });
    it('should set the value of the validation to false if isWelsh is false', () => {
      component.isWelsh = false;
      component.ngOnChanges();
      expect(component.formGroup.get('languagePreferences').value).toEqual('false');
    });
    it('should set the value to isWelsh if not a delegated test', () => {
      component.isWelsh = false;
      component.isDelegated = false;
      component.ngOnChanges();
      expect(component.formGroup.get('languagePreferences').value).toEqual('false');
    });
    it('should set the value to false if its a delegated test and form isnt dirty', () => {
      component.isDelegated = true;
      component.ngOnChanges();
      expect(component.formGroup.get('languagePreferences').value).toEqual('false');
    });
  });

});
