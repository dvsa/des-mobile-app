import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { getETA, hasExaminerTakenAction } from '@store/tests/test-data/common/test-data.selector';
import { ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { CompetencyButtonComponent } from '../competency-button/competency-button';
import { etaLabels } from './eta.constants';

@Component({
  selector: 'eta',
  templateUrl: 'eta.html',
  styleUrls: ['eta.scss'],
  imports: [CompetencyButtonComponent, NgClass],
})
export class EtaComponent {
  readonly eta = input<ExaminerActions>();

  touchStateDelay = 100;

  touchState = false;
  private readonly tests = this.store$.selectSignal(getTests);
  private readonly currentTest = computed(() => getCurrentTest(this.tests()));
  private readonly testData = computed(() => getTestData(this.currentTest()));
  private readonly etaState = computed(() => getETA(this.testData()));
  actionTaken = computed(() => hasExaminerTakenAction(this.etaState(), this.eta()));
  label = computed(() => etaLabels[this.eta()]);

  constructor(public store$: Store<StoreModel>) {}

  toggleETA = (): void => {
    this.store$.dispatch(ToggleETA(this.eta()));
  };
}
