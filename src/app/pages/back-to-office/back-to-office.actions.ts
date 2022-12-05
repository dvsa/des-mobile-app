import { createAction } from '@ngrx/store';

export const BackToOfficeViewDidEnter = createAction(
  '[BackToOfficePage] BackToOffice view did enter',
);

export const ClearVehicleData = createAction(
  '[BackToOfficePage] BackToOffice clear vehicle data',
);

export const DeferWriteUp = createAction(
  '[BackToOfficePage] Defer write-up',
);

export const ASAMPopupPresented = createAction(
  '[BackToOfficePage] ASAM popup presented',
);
