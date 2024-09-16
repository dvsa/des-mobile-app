import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ClearVehicleData } from '@pages/back-to-office/back-to-office.actions';
import { MotHistoryApiService } from '@providers/mot-history-api/mot-history-api.service';
import { map } from 'rxjs/operators';

@Injectable()
export class BackToOfficeEffects {
  constructor(
    private actions$: Actions,
    private vehicleDetailsApiService: MotHistoryApiService
  ) {}

  clearVehicleData$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ClearVehicleData),
        map(() => this.vehicleDetailsApiService.clearVehicleData())
      ),
    { dispatch: false }
  );
}
