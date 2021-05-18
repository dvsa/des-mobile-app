import { Component, OnInit, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { StoreModel } from '@shared/models/store.model';
import { getTests } from '@store/tests/tests.reducer';
import { getCurrentTest } from '@store/tests/tests.selector';
import { getTestData } from '@store/tests/test-data/cat-b/test-data.reducer';
import { ToggleETA } from '@store/tests/test-data/common/eta/eta.actions';
import { getETA, hasExaminerTakenAction } from '@store/tests/test-data/common/test-data.selector';
import { ExaminerActions } from '@store/tests/test-data/test-data.constants';
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

  touchStateDelay: number = 100;

  touchState: boolean = false;
  touchTimeout: any;

  componentState: ETAComponentState;
  constructor(private store$: Store<StoreModel>) { }

  ngOnInit(): void {
    this.componentState = {
      actionTaken$: this.store$.pipe(
        select(getTests),
        select(getCurrentTest),
        select(getTestData),
        select(getETA),
        select(eta => hasExaminerTakenAction(eta, this.eta)),
      ),
    };
  }

  getLabel = (): string => etaLabels[this.eta];

  toggleETA = (): void => {
    this.store$.dispatch(ToggleETA(this.eta));
  }

}
