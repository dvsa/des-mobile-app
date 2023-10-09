import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getTests } from '@store/tests/tests.reducer';
import { TestResultSchemasUnion } from '@dvsa/mes-test-schema/categories';
import { getStartedTests } from '@store/tests/tests.selector';
import { ExaminerStatsViewDidEnter } from '@pages/examiner-stats/examiner-stats.actions';
import { get } from 'lodash';

interface ExaminerStatsState {
  startedTests$: Observable<{ [slotId: string]: TestResultSchemasUnion }>;
}

@Component({
  selector: 'examiner-stats',
  templateUrl: './examiner-stats.page.html',
  styleUrls: ['./examiner-stats.page.scss'],
})

export class ExaminerStatsPage implements OnInit {

  merged$: Observable<any>;

  public routesUsed = [];
  public manoeuvresUsed = [];
  public showMeQuestionsUsed = [];
  public tellMeQuestionsUsed = [];

  constructor(
    public store$: Store<StoreModel>,
  ) {
  }

  pageState: ExaminerStatsState;


  ngOnInit(): void {
    this.pageState = {
      startedTests$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
      ),
    };

    this.pageState.startedTests$.subscribe(value => {
      for (let key in value) {
        this.routesUsed.push(get(value[key], 'testSummary.routeNumber'));
        this.manoeuvresUsed.push(Object.keys(get(value[key], 'testData.manoeuvres')));
        if (!!get(value[key], 'testData.vehicleChecks.showMeQuestion.code')) {
          this.showMeQuestionsUsed.push(`${get(value[key], 'testData.vehicleChecks.showMeQuestion.code')}
        - ${get(value[key], 'testData.vehicleChecks.showMeQuestion.description')}`);
        }
        if (!!get(value[key], 'testData.vehicleChecks.tellMeQuestion.code')) {
          this.tellMeQuestionsUsed.push(`${get(value[key], 'testData.vehicleChecks.tellMeQuestion.code')}
        - ${get(value[key], 'testData.vehicleChecks.tellMeQuestion.description')}`);
        }
      }
      this.routesUsed = this.handleArray(this.routesUsed);
      this.manoeuvresUsed = this.handleManoeuvres(this.manoeuvresUsed);
      this.tellMeQuestionsUsed = this.handleArray(this.tellMeQuestionsUsed);
      this.showMeQuestionsUsed = this.handleArray(this.showMeQuestionsUsed);
    }).unsubscribe();
  }

  ionViewDidEnter() {
    this.store$.dispatch(ExaminerStatsViewDidEnter());
  }

  handleArray(array: any[]) {
    array = array.filter(value => !([null, undefined, '', []].includes(value)));
    let tempObject = {};
    for (let element of array) {
      if (tempObject[element]) {
        tempObject[element] += 1;
      } else {
        tempObject[element] = 1;
      }
    }
    return Object.entries(tempObject);
  }

  handleManoeuvres(manoeuvresUsed: any[]) {
    let tempArray = [];
    manoeuvresUsed.forEach((i) => {
      i.forEach((j) => {
        tempArray.push(j.replace(/([A-Z])/g, ' $1').charAt(0).toUpperCase()
          + j.replace(/([A-Z])/g, ' $1').slice(1).toLowerCase());
      });
    });
    return this.handleArray(tempArray);
  }
}
