import { Component, OnInit, computed } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ClearCandidateLicenceData } from '@pages/candidate-licence/candidate-licence.actions';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { WaitingRoomToCarValidationError } from '@pages/waiting-room-to-car/waiting-room-to-car.actions';
import { QuestionProvider } from '@providers/question/question';
import { VehicleChecksQuestion } from '@providers/question/vehicle-checks-question.model';
import { WaitingRoomToCarBasePageComponent } from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';
import { getInstructorDetails } from '@store/tests/instructor-details/instructor-details.reducer';
import { getInstructorRegistrationNumber } from '@store/tests/instructor-details/instructor-details.selector';
import {
  getTellMeQuestion,
  getVehicleChecks,
  isTellMeQuestionSelected,
  tellMeQuestionOutcome,
} from '@store/tests/test-data/cat-b/test-data.cat-b.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  QuestionOutcomes,
  TellMeQuestionCorrect,
  TellMeQuestionDrivingFault,
  TellMeQuestionSelected,
} from '@store/tests/test-data/cat-b/vehicle-checks/vehicle-checks.actions';
import { EyesightTestReset } from '@store/tests/test-data/common/eyesight-test/eyesight-test.actions';
import {
  MotEvidenceChanged,
  MotEvidenceProvidedReset,
  MotEvidenceProvidedToggled,
} from '@store/tests/vehicle-details/vehicle-details.actions';

@Component({
  selector: 'app-waiting-room-to-car-cat-b',
  templateUrl: './waiting-room-to-car.cat-b.page.html',
  styleUrls: ['./waiting-room-to-car.cat-b.page.scss'],
  standalone: false,
})
export class WaitingRoomToCarCatBPage extends WaitingRoomToCarBasePageComponent implements OnInit {
  form: UntypedFormGroup;
  tellMeQuestions: VehicleChecksQuestion[];

  tellMeQuestion = computed(() => {
    const currentTest = this.currentTest();
    if (!currentTest) {
      return null;
    }
    return getTellMeQuestion(getVehicleChecks(getTestData(currentTest as never)));
  });

  tellMeQuestionOutcome = computed(() => {
    const currentTest = this.currentTest();
    if (!currentTest) {
      return null;
    }
    return tellMeQuestionOutcome(getVehicleChecks(getTestData(currentTest as never)));
  });

  tellMeQuestionSelected = computed(() => {
    const currentTest = this.currentTest();
    if (!currentTest) {
      return false;
    }
    return isTellMeQuestionSelected(getVehicleChecks(getTestData(currentTest as never)));
  });

  instructorRegistrationNumber = computed(() => {
    const currentTest = this.currentTest();
    if (!currentTest) {
      return null;
    }
    return getInstructorRegistrationNumber(getInstructorDetails(currentTest as never));
  });

  constructor(private questionProvider: QuestionProvider) {
    super();
    this.tellMeQuestions = this.questionProvider.getTellMeQuestions(TestCategory.B);
    this.form = new UntypedFormGroup({});
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  motNoEvidenceCancelled = (): void => {
    this.form.get('alternateEvidenceCtrl')?.reset();
    this.store$.dispatch(MotEvidenceProvidedReset());
  };

  onSubmit = async (): Promise<void> => {
    Object.keys(this.form.controls).forEach((controlName: string) => this.form.controls[controlName].markAsDirty());

    if (this.form.valid) {
      this.store$.dispatch(ClearCandidateLicenceData());

      await this.routeByCategoryProvider.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, this.testCategory, {
        replaceUrl: true,
      });
      return;
    }

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (this.form.controls[controlName].invalid) {
        this.store$.dispatch(WaitingRoomToCarValidationError(`${controlName} is blank`));
      }
    });
  };

  eyesightFailCancelled = (): void => {
    this.form.get('eyesightCtrl')?.reset();
    this.store$.dispatch(EyesightTestReset());
  };

  tellMeQuestionChanged(newTellMeQuestion: VehicleChecksQuestion): void {
    this.store$.dispatch(TellMeQuestionSelected(newTellMeQuestion));

    if (this.form.controls.tellMeQuestionOutcome) {
      this.form.controls.tellMeQuestionOutcome.setValue('');
    }
  }

  tellMeQuestionOutcomeChanged(outcome: string): void {
    if (outcome === QuestionOutcomes.Pass) {
      this.store$.dispatch(TellMeQuestionCorrect());
      return;
    }
    this.store$.dispatch(TellMeQuestionDrivingFault());
  }

  protected readonly MotEvidenceChanged = MotEvidenceChanged;
  protected readonly MotEvidenceProvidedToggled = MotEvidenceProvidedToggled;
}
