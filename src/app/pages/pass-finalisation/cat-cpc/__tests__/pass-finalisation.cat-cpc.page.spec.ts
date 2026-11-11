import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PracticeModeOptionsBar } from '@components/common/practice-mode-options-bar/practice-mode-options-bar';
import { WarningBannerComponent } from '@components/common/warning-banner/warning-banner';
import { DebriefWitnessedComponent } from '@components/test-finalisation/debrief-witnessed/debrief-witnessed';
import { FinalisationHeaderComponent } from '@components/test-finalisation/finalisation-header/finalisation-header';
import { LanguagePreferencesComponent } from '@components/test-finalisation/language-preference/language-preference';

import { provideBasePageMocks } from '@mocks/test-providers';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { PassCertificateNumberComponent } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number';
import { PASS_CERTIFICATE_NUMBER_CTRL } from '@pages/pass-finalisation/components/pass-certificate-number/pass-certificate-number.constants';
import { PassFinalisationValidationError } from '@pages/pass-finalisation/pass-finalisation.actions';

import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { StoreModel } from '@shared/models/store.model';
import { PersistTests } from '@store/tests/tests.actions';
import { MockComponent } from 'ng-mocks';
import { Observable, Subscription } from 'rxjs';
import { PassFinalisationCatCPCPage } from '../pass-finalisation.cat-cpc.page';

describe('PassFinalisationCatCPCPage', () => {
  let fixture: ComponentFixture<PassFinalisationCatCPCPage>;
  let component: PassFinalisationCatCPCPage;
  let store$: Store<StoreModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterModule.forRoot([]),

        PassFinalisationCatCPCPage,
        MockComponent(PracticeModeOptionsBar),
        MockComponent(PassCertificateNumberComponent),
        MockComponent(DebriefWitnessedComponent),
        MockComponent(FinalisationHeaderComponent),
        MockComponent(LanguagePreferencesComponent),
        MockComponent(WarningBannerComponent),
      ],
      providers: [provideBasePageMocks(), provideMockStore(), OutcomeBehaviourMapProvider],
    });

    fixture = TestBed.createComponent(PassFinalisationCatCPCPage);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);
    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    component.subscription = new Subscription();
  });

  describe('Class', () => {
    describe('ionViewDidLeave', () => {
      it('should unsubscribe from subscription if there is one', () => {
        component.subscription = new Subscription();
        vi.spyOn(component.subscription, 'unsubscribe').mockReturnValue(undefined);
        component.ionViewDidLeave();
        expect(component.subscription.unsubscribe).toHaveBeenCalled();
      });
    });
    describe('ionViewWillEnter', () => {
      it('should setup subscription if merged is present', () => {
        component.merged$ = new Observable<string | boolean>();
        component.ionViewWillEnter();

        expect(component.subscription).toBeDefined();
      });
    });
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
