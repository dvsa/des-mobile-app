import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { map, take, withLatestFrom } from 'rxjs/operators';
import { getTests } from '@store/tests/tests.reducer';
import { getStartedTests } from '@store/tests/tests.selector';
import { ExaminerStatsViewDidEnter } from '@pages/examiner-stats/examiner-stats.actions';
import {
  ExaminerStatData,
  getControlledStopCount,
  getManoeuvresUsed,
  getPassedTestCount,
  getRouteNumbers,
  getShowMeQuestions,
  getStartedTestCount,
  getTellMeQuestions,
} from '@pages/examiner-stats/examiner-stats.selector';
import { UntypedFormGroup } from '@angular/forms';

export enum BaseManoeuvreTypeLabels {
  reverseLeft = 'Reverse left',
  reverseRight = 'Reverse right',
  reverseParkRoad = 'Reverse park (road)',
  reverseParkCarpark = 'Reverse park (car park)',
  forwardPark = 'Forward park',
  reverseManoeuvre = 'Reverse',
}

export enum AlternativeManoeuvreTypeLabels {
  reverseLeft = 'Reverse',
  reverseRight = 'Reverse right',
  reverseParkRoad = 'Reverse park (road)',
  reverseParkCarpark = 'Reverse park (car park)',
  forwardPark = 'Forward park',
  reverseManoeuvre = 'Reverse',
}

interface ExaminerStatsState {
  routeNumbers$: Observable<ExaminerStatData[]>;
  manoeuvres$: Observable<ExaminerStatData[]>;
  showMeQuestions$: Observable<ExaminerStatData[]>;
  tellMeQuestions$: Observable<ExaminerStatData[]>;
  testCount$: Observable<number>;
  passPercentage$: Observable<string>;
  controlledStopCount$: Observable<string>;
}

export const enum FilterEnum {
  Both = 'Both',
  Data_Only = 'Data',
  Chart_Only = 'Chart',
}

@Component({
  selector: 'examiner-stats',
  templateUrl: './examiner-stats.page.html',
  styleUrls: ['./examiner-stats.page.scss'],
})
export class ExaminerStatsPage implements OnInit {

  merged$: Observable<any>;
  form: UntypedFormGroup = new UntypedFormGroup({});

  constructor(
    public store$: Store<StoreModel>,
  ) {
  }

  pageState: ExaminerStatsState;
  filterOption: FilterEnum = FilterEnum.Both;
  colors: string[] = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];

  ngOnInit(): void {
    this.pageState = {
      routeNumbers$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(getRouteNumbers),
        take(1),
      ),
      passPercentage$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(getStartedTestCount),
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            map(getStartedTests),
            map(getPassedTestCount),
          ),
        ),
        map(([started, passed]) =>
          `${((passed / started) * 100).toFixed(2)}%`,
        ),
        take(1),
      ),
      controlledStopCount$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(getStartedTestCount),
        withLatestFrom(
          this.store$.pipe(
            select(getTests),
            map(getStartedTests),
            map(getControlledStopCount),
          ),
        ),
        map(([started, controlledStop]) =>
          `${((controlledStop / started) * 100).toFixed(2)}%`,
        ),
        take(1),
      ),
      testCount$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(getStartedTestCount),
        take(1),
      ),
      manoeuvres$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(getManoeuvresUsed),
        take(1),
      ),
      showMeQuestions$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(getShowMeQuestions),
        take(1),
      ),
      tellMeQuestions$: this.store$.pipe(
        select(getTests),
        map(getStartedTests),
        map(getTellMeQuestions),
        take(1),
      ),
    };
  }

  ionViewDidEnter() {
    this.store$.dispatch(ExaminerStatsViewDidEnter());
  }

  handleGrid(object: { item: string, count: number }[]): [string, number][] {
    return object.map((val) => [val.item, val.count]);
  }
}
