import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { MotDetailsProvider } from '@providers/mot-details/mot-details';
import { ClearVehicleData } from '@pages/back-to-office/back-to-office.actions';

@Injectable()
export class BackToOfficeEffects {

  constructor(
    private actions$: Actions,
    private motDetailsProvider: MotDetailsProvider,
  ) {
  }

  clearVehicleData$ = createEffect(() => this.actions$.pipe(
    ofType(ClearVehicleData),
    map(() => this.motDetailsProvider.clearMotData()),
  ), { dispatch: false });
}
