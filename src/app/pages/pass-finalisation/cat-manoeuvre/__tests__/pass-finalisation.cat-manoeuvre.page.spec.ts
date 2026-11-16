import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { D255Component } from '@components/test-finalisation/d255/d255';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { PassFinalisationCatManoeuvrePage } from '@pages/pass-finalisation/cat-manoeuvre/pass-finalisation.cat-manoeuvre.page';
import { LicenceProvidedWarningBannerComponent } from '@pages/pass-finalisation/components/licence-provided-warning-banner/licence-provided-warning-banner';
import { LicenseProvidedComponent } from '@pages/pass-finalisation/components/license-provided/license-provided';
import { PassCertificateNumberComponent } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import { PassFinalisationValidationError } from '@pages/pass-finalisation/pass-finalisation.actions';

import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { StoreModel } from '@shared/models/store.model';
import { PersistTests } from '@store/tests/tests.actions';
import { MockComponent } from 'ng-mocks';

describe('PassFinalisationCatManoeuvrePage', () => {
  let fixture: ComponentFixture<PassFinalisationCatManoeuvrePage>;
  let component: PassFinalisationCatManoeuvrePage;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterModule.forRoot([]),

        PassFinalisationCatManoeuvrePage,
        MockComponent(PracticeModeOptionsBar),
        MockComponent(PassCertificateNumberComponent),
        MockComponent(LicenseProvidedComponent),
        MockComponent(D255Component),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(WarningBannerComponent),
        MockComponent(LicenceProvidedWarningBannerComponent),
      ],
      providers: [provideBasePageMocks(), provideMockStore(), OutcomeBehaviourMapProvider],
    });

    fixture = TestBed.createComponent(PassFinalisationCatManoeuvrePage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
  });

  describe('Class', () => {
    describe('onSubmit', () => {
      it('should dispatch the PersistTests action', () => {
        component.onSubmit();
        expect(store$.dispatch).toHaveBeenCalledWith(PersistTests());
      });
      it('should dispatch the appropriate ValidationError actions', async () => {
        vi.useFakeTimers();
        try {
          component.form = new UntypedFormGroup({
            requiredControl1: new UntypedFormControl(null, [Validators.required]),
            requiredControl2: new UntypedFormControl(null, [Validators.required]),
            [PASS_CERTIFICATE_NUMBER_CTRL]: new UntypedFormControl(null, [Validators.required]),
            notRequiredControl: new UntypedFormControl(null),
          });

          component.onSubmit();
          await vi.advanceTimersByTimeAsync(0);
          expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl1 is blank'));
          expect(store$.dispatch).toHaveBeenCalledWith(PassFinalisationValidationError('requiredControl2 is blank'));
          expect(store$.dispatch).toHaveBeenCalledWith(
            PassFinalisationValidationError(`${PASS_CERTIFICATE_NUMBER_CTRL} is invalid`)
          );
          expect(store$.dispatch).not.toHaveBeenCalledWith(
            PassFinalisationValidationError('notRequiredControl is blank')
          );
        } finally {
          vi.useRealTimers();
        }
      });
    });
  });
});
