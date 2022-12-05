import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  map,
} from 'rxjs/operators';
import { VehicleDetailsApiService } from '@providers/vehicle-details-api/vehicle-details-api.service';
import { ClearVehicleData } from '@pages/back-to-office/back-to-office.actions';

@Injectable()
export class BackToOfficeEffects {

  constructor(
    private actions$: Actions,
    private vehicleDetailsApiService: VehicleDetailsApiService,
  ) {}

  clearVehicleData$ = createEffect(() => this.actions$.pipe(
    ofType(ClearVehicleData),
    map(() => this.vehicleDetailsApiService.clearVehicleData()),
  ), { dispatch: false });
}
