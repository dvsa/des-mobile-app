import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getTests } from '@store/tests/tests.reducer';
import { getStartedTests } from '@store/tests/tests.selector';
import { ExaminerStatsViewDidEnter } from '@pages/examiner-stats/examiner-stats.actions';
import {
  getManoeuvresUsed,
  getRouteNumbers,
  getShowMeQuestions,
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
  routeNumbers$: Observable<any[]>;
  manoeuvres$: Observable<any[]>;
  showMeQuestions$: Observable<any[]>;
  tellMeQuestions$: Observable<any[]>;
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
        ),
        manoeuvres$: this.store$.pipe(
          select(getTests),
          map(getStartedTests),
          map(getManoeuvresUsed),
        ),
        showMeQuestions$: this.store$.pipe(
          select(getTests),
          map(getStartedTests),
          map(getShowMeQuestions),
        ),
        tellMeQuestions$: this.store$.pipe(
          select(getTests),
          map(getStartedTests),
          map(getTellMeQuestions),
        ),
      };
    }

    ionViewDidEnter() {
      this.store$.dispatch(ExaminerStatsViewDidEnter());
    }

    handleGrid(object: { item: string, count: number }[]) {
      let tempArray = [];
      object.forEach((val: { item: string, count: number }) => {
        tempArray.push([val.item, val.count]);
      });
      return tempArray;
    }
}
