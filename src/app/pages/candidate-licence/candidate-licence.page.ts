import { Component, computed, inject, OnInit } from '@angular/core';
import { DriverLicenceSchema, DriverPhotograph } from '@dvsa/mes-driver-schema';
import moment from 'moment';
import { FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

import { TrueLikenessToPhotoChanged } from '@store/tests/test-summary/test-summary.actions';
import {
  selectCandidateDriverNumber,
  selectDateOfBirth,
  selectGenderFullDescription,
  selectGenderSilhouettePath,
  selectUntitledCandidateName,
} from '@store/tests/journal-data/common/candidate/candidate.selector';
import { selectTestCategory } from '@store/tests/category/category.reducer';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CandidateLicenceErr, CandidateLicenceProvider } from '@providers/candidate-licence/candidate-licence';
import { PracticeableBasePageComponent } from '@shared/classes/practiceable-base-page';
import {
  selectApplicationNumber,
} from '@store/tests/journal-data/common/application-reference/application-reference.selector';
import {
  CandidateLicenceDataValidationError,
  CandidateLicenceViewDidEnter,
} from '@pages/candidate-licence/candidate-licence.actions';
import { selectRekey } from '@store/tests/rekey/rekey.reducer';
import { selectTrueLikenessToPhoto } from '@store/tests/test-summary/test-summary.selector';

// Retained this pattern as this data is not persisted to store so no selectors will be made;
interface CandidateLicencePageState {
  candidateData$: Observable<DriverLicenceSchema>;
}

@Component({
  selector: 'app-candidate-licence',
  templateUrl: 'candidate-licence.page.html',
  styleUrls: ['candidate-licence.page.scss'],
})
export class CandidateLicencePage extends PracticeableBasePageComponent implements OnInit {
  formGroup: FormGroup;
  pageState: CandidateLicencePageState;
  driverDataReturned: boolean = false;
  candidateDataError: boolean = false;
  candidateDataUnavailable: boolean = false;
  niLicenceDetected: boolean = false;
  offlineError: boolean = false;

  // providers
  private candidateLicenceProvider = inject(CandidateLicenceProvider);
  private domSanitizer = inject(DomSanitizer);
  // page state
  candidateUntitledName = this.store$.selectSignal(selectUntitledCandidateName)();
  candidateDriverNumber = this.store$.selectSignal(selectCandidateDriverNumber)();
  testCategory = this.store$.selectSignal(selectTestCategory)();
  driverPhotograph = this.store$.selectSignal(selectGenderSilhouettePath)();
  isRekey = this.store$.selectSignal(selectRekey)();
  genderDescription = this.store$.selectSignal(selectGenderFullDescription)();
  appRef = this.store$.selectSignal(selectApplicationNumber)();
  dateOfBirth = this.store$.selectSignal(selectDateOfBirth)();
  age = computed(() => moment()
    .diff(this.dateOfBirth, 'years'))();
  trueLikeness = this.store$.selectSignal(selectTrueLikenessToPhoto)();

  constructor() {
    super();
    this.formGroup = new FormGroup({});
  }

  ngOnInit() {
    this.pageState = {
      candidateData$: of(null)
        .pipe(
          filter(() => !this.isPracticeMode && !this.isRekey),
          switchMap(() => this.candidateLicenceProvider.getCandidateData(this.candidateDriverNumber, this.appRef)),
          catchError((err) => {
            if (err instanceof Error) {
              this.setError(err);
            } else {
              this.candidateDataError = true;
            }
            this.driverDataReturned = false;
            return of(null);
          }),
          tap(() => this.driverDataReturned = true),
        ),
    };
  }

  ionViewDidEnter(): void {
    this.store$.dispatch(CandidateLicenceViewDidEnter());
  }

  trueLikenessToPhotoChanged(trueLikeness: boolean): void {
    this.store$.dispatch(TrueLikenessToPhotoChanged(trueLikeness));
  }

  getImage = (img: string = null, driverPhotograph: DriverPhotograph): SafeUrl => {
    // practice mode will use silhouettes;
    if (img && this.isPracticeMode) {
      return img;
    }
    // means not in practice mode, but data not yet returned from EP or no data exists;
    if (!img || !this.driverDataReturned || !driverPhotograph) {
      return null;
    }
    const {
      image,
      imageFormat,
    } = driverPhotograph?.photograph;
    return this.domSanitizer.bypassSecurityTrustUrl(`data:${imageFormat};base64,${image}`);
  };

  onContinue = async (): Promise<void> => {
    Object.keys(this.formGroup.controls)
      .forEach((controlName) => this.formGroup.controls[controlName].markAsDirty());

    if (this.formGroup.valid) {
      await this.router.navigate([TestFlowPageNames.COMMUNICATION_PAGE]);
      return;
    }

    Object.keys(this.formGroup.controls)
      .forEach((controlName) => {
        if (this.formGroup.controls[controlName].invalid) {
          this.store$.dispatch(CandidateLicenceDataValidationError(`${controlName} is blank`));
        }
      });
  };

  get hasErrored(): boolean {
    return (
      this.offlineError
      || this.candidateDataError
      || this.candidateDataUnavailable
      || this.niLicenceDetected
    );
  }

  private setError(err: Error): void {
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
