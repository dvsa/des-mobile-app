import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { provideTestTranslations } from '@mocks/test-providers';
import { TranslateService } from '@ngx-translate/core';
import { ProvidedEmailComponent } from '../provided-email';

describe('ProvidedEmailComponent', () => {
  let fixture: ComponentFixture<ProvidedEmailComponent>;
  let component: ProvidedEmailComponent;
  let translate: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProvidedEmailComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideTestTranslations()],
    });

    fixture = TestBed.createComponent(ProvidedEmailComponent);
    component = fixture.componentInstance;
    component.formGroup = new UntypedFormGroup({});
    component.formGroup.addControl('radioCtrl', new UntypedFormControl());
    component.shouldRender = true;
    component.isProvidedEmailAddressChosen = true;
    translate = TestBed.inject(TranslateService);
    translate.setFallbackLang('en');
  });

  describe('DOM', () => {
    describe('i18n', () => {
      it('should render in English by default', async () => {
        await new Promise<void>((done, reject) => {
          translate.use('en').subscribe(() => {
            try {
              fixture.detectChanges();
              expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim()).toBe(
                'The following email address was used when booking the test:'
              );
              expect(fixture.debugElement.query(By.css('#providedEmail + label')).nativeElement.innerHTML.trim()).toBe(
                'By email (provided at time of booking)'
              );
              done();
            } catch (error) {
              reject(error);
            }
          }, reject);
        });
      });

      it('should render in Welsh when its a Welsh test', async () => {
        await new Promise<void>((done, reject) => {
          translate.use('cy').subscribe(() => {
            try {
              fixture.detectChanges();
              expect(fixture.debugElement.query(By.css('.communication-text')).nativeElement.innerHTML.trim()).toBe(
                "Defnyddiwyd y cyfeiriad e-bost dilynol wrth archebu'r prawf:"
              );
              expect(fixture.debugElement.query(By.css('#providedEmail + label')).nativeElement.innerHTML.trim()).toBe(
                'Trwy e-bost (a ddarparwyd ar adeg archebu)'
              );
              done();
            } catch (error) {
              reject(error);
            }
          }, reject);
        });
      });
    });
  });

  describe('ngOnChanges', () => {
    it('should set up the  form control if there is not already one', () => {
      component.radioButtonControl = null;
      component.ngOnChanges();
      expect(component.formGroup.get(ProvidedEmailComponent.radioCtrl)).not.toBeNull();
    });
  });

  describe('providedEmailRadioSelected', () => {
    it('should emit newEmailRadioSelect with correct parameters', () => {
      vi.spyOn(component.providedEmailRadioSelect, 'emit').mockReturnValue(undefined);
      component.providedEmailRadioSelected();
      expect(component.providedEmailRadioSelect.emit).toHaveBeenCalledWith(ProvidedEmailComponent.providedEmail);
    });
  });
});
