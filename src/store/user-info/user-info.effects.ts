import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {map} from 'rxjs/operators';
import {LoadEmployeeName, LoadEmployeeNameSuccess} from '@store/user-info/user-info.actions';

@Injectable()
export class UserInfoEffects {

  constructor(
    private actions$: Actions,
  ) {
  }

  loadEmployeeName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadEmployeeName),
      map(action => {
        console.log('employee name loaded:', action.employeeName);
        return LoadEmployeeNameSuccess({employeeName: action.employeeName})
      })
    )
  );
}
