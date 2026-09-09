import { Component, OnInit, Signal, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DriverLicenceSchema, DriverPhotograph } from '@dvsa/mes-driver-schema';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { select } from '@ngrx/store';
import {
  CandidateLicenceDataValidationError,
  CandidateLicenceViewDidEnter,
} from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CandidateLicenceErr, CandidateLicenceProvider } from '@providers/candidate-licence/candidate-licence';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import { DateTime, Duration } from '@shared/helpers/date-time';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { getApplicationReference } from '@store/tests/journal-data/common/application-reference/application-reference.reducer';
import { getApplicationNumber } from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import { getCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';
import {
  getCandidateDriverNumber,
  selectDateOfBirth,
  selectFormatDriverNumber,
  selectGenderFullDescription,
  selectGenderSilhouettePath,
  selectUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { getRekeyIndicator } from '@store/tests/rekey/rekey.reducer';
import { isRekey } from '@store/tests/rekey/rekey.selector';
import { TrueLikenessToPhotoChanged } from '@store/tests/test-summary/test-summary.actions';
import { selectTrueLikenessToPhoto } from '@store/tests/test-summary/test-summary.selector';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest, getJournalData, selectCurrentTest, selectIsRekey } from '@store/tests/tests.selector';
import { get } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { catchError, filter, switchMap, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-candidate-licence',
  templateUrl: './candidate-licence.page.html',
  styleUrls: ['./candidate-licence.page.scss'],
  standalone: false,
})
export class CandidateLicencePage extends PracticeableBasePageComponent implements OnInit {
  formGroup: FormGroup;
  driverDataReturned = false;
  candidateDataError = false;
  candidateDataUnavailable = false;
  niLicenceDetected = false;
  offlineError = false;

  candidateUntitledName: Signal<string> = this.store$.selectSignal(selectUntitledCandidateName);
  candidateDriverNumber: Signal<string> = this.store$.selectSignal(selectFormatDriverNumber);
  testCategory: Signal<CategoryCode> = this.store$.selectSignal(selectTestCategory);
  trueLikenessToPhoto: Signal<boolean> = this.store$.selectSignal(selectTrueLikenessToPhoto);
  driverPhotograph: Signal<string> = this.store$.selectSignal(selectGenderSilhouettePath);
  genderDescription: Signal<string> = this.store$.selectSignal(selectGenderFullDescription);
  dateOfBirth: Signal<string> = this.store$.selectSignal(selectDateOfBirth);
  isRekeySignal: Signal<boolean> = this.store$.selectSignal(selectIsRekey);
  currentTest = this.store$.selectSignal(selectCurrentTest);
  age: Signal<number> = computed(() =>
    this.dateOfBirth() ? new DateTime().diff(this.dateOfBirth(), Duration.YEAR) : null
  );
  // candidateData: WritableSignal<DriverLicenceSchema | null> = signal(null);

  candidateData$: Observable<DriverLicenceSchema>;

  // candidateDataRequest = computed(() => {
  //   const currentTest = this.currentTest();
  //   const driverNumber = currentTest?.journalData?.candidate?.driverNumber;
  //   const appRef = getApplicationNumber(currentTest?.journalData?.applicationReference);
  //
  //   if (this.isPracticeMode || this.isRekeySignal() || !driverNumber || !appRef) {
  //     return null;
  //   }
  //
  //   return {driverNumber, appRef};
  // });

  constructor(
    private candidateLicenceProvider: CandidateLicenceProvider,
    private domSanitizer: DomSanitizer
  ) {
    super(false);
    this.formGroup = new FormGroup({});
  }

  ngOnInit() {
    super.ngOnInit();
    const currentTest$ = this.store$.pipe(select(getTests), select(getCurrentTest));
    this.candidateData$ = currentTest$.pipe(
      select(getJournalData),
      select(getCandidate),
      select(getCandidateDriverNumber),
      withLatestFrom(
        currentTest$.pipe(select(getJournalData), select(getApplicationReference), select(getApplicationNumber)),
        currentTest$.pipe(select(getRekeyIndicator), select(isRekey))
      ),
      filter(([, , isRekeyTest]) => !this.isPracticeMode && !isRekeyTest),
      switchMap(([driverNumber, appRef]) => this.candidateLicenceProvider.getCandidateData(driverNumber, appRef)),
      catchError((err) => {
        if (err instanceof Error) {
          this.setError(err);
        } else {
          this.candidateDataError = true;
        }
        this.driverDataReturned = false;
        return of(null);
      }),
      tap(() => (this.driverDataReturned = true))
    );
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(CandidateLicenceViewDidEnter());
  }

  trueLikenessToPhotoChanged(trueLikeness: boolean): void {
    this.store$.dispatch(TrueLikenessToPhotoChanged(trueLikeness));
  }

  getImage = (driverPhotograph: DriverPhotograph, img: string = null): SafeUrl => {
    // practice mode will use silhouettes;
    if (img && this.isPracticeMode) {
      return img;
    }
    // means not in practice mode, but data not yet returned from EP or no data exists;
    if (!img || !this.driverDataReturned || !driverPhotograph || !get(driverPhotograph, 'photograph', null)) {
      return null;
    }
    const { image, imageFormat } = driverPhotograph.photograph;
    return this.domSanitizer.bypassSecurityTrustUrl(`data:${imageFormat};base64,${image}`);
  };

  onContinue = async (): Promise<void> => {
    Object.keys(this.formGroup.controls).forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());

    if (this.formGroup.valid) {
      await this.router.navigate([TestFlowPageNames.COMMUNICATION_PAGE]);
      return;
    }

    Object.keys(this.formGroup.controls).forEach((controlName) => {
      if (this.formGroup.controls[controlName].invalid) {
        this.store$.dispatch(CandidateLicenceDataValidationError(`${controlName} is blank`));
      }
    });
  };

  get hasErrored(): boolean {
    return this.offlineError || this.candidateDataError || this.candidateDataUnavailable || this.niLicenceDetected;
  }

  setError(err: Error): void {
    switch (err.message) {
      case CandidateLicenceErr.OFFLINE:
        this.offlineError = true;
        break;
      case CandidateLicenceErr.UNAVAILABLE:
        this.candidateDataUnavailable = true;
        break;
      case CandidateLicenceErr.NI_LICENCE:
        this.niLicenceDetected = true;
        break;
      default:
        this.candidateDataError = true;
    }
  }
}
