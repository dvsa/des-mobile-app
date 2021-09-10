import * as officeActions from './office.actions';
import { OfficeModel } from './office.model';

export const initialState: OfficeModel = {
  dangerousFaultComments: [],
  drivingFaultComments: [],
  seriousFaultComments: [],
};

export function officeReducer(state = initialState, action: officeActions.OfficeActionTypes): OfficeModel {
  switch (action.type) {
    default:
      return state;
  }

}
