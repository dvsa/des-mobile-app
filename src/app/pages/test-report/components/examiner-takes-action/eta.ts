import { Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { getETA, hasExaminerTakenAction } from '@store/tests/test-data/common/test-data.selector';
import { ExaminerActions } from '@store/tests/test-data/test-data.constants';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { Observable } from 'rxjs';
import { etaLabels } from './eta.constants';

interface ETAComponentState {
  actionTaken$: Observable<boolean>;
}

@Component({
  selector: 'eta',
  templateUrl: 'eta.html',
  styleUrls: ['eta.scss'],
})
export class EtaComponent implements OnInit {
  @Input()
  eta: ExaminerActions;

  touchStateDelay = 100;

  touchState = false;
  label: string;

  componentState: ETAComponentState;

  constructor(private store$: Store<StoreModel>) {}

  ngOnInit(): void {
    this.componentState = {
      actionTaken$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getTestData),
        select(getETA),
        select((eta) => hasExaminerTakenAction(eta, this.eta))
      ),
    };

    this.label = etaLabels[this.eta];
  }

  toggleETA = (): void => {
    this.store$.dispatch(ToggleETA(this.eta));
  };
}
