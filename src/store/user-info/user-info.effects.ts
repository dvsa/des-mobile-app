import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { LoadEmployeeName, LoadEmployeeNameSuccess } from '@store/user-info/user-info.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class UserInfoEffects {
  constructor(private actions$: Actions) {}

  loadEmployeeName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoadEmployeeName),
      map((action) => {
        console.log('employee name loaded:', action.employeeName);
        return LoadEmployeeNameSuccess({ employeeName: action.employeeName });
      })
    )
  );
}
