// import * as vehicleDetailsActions from '../common/vehicle-details.actions';
// import { VehicleDetails } from '@dvsa/mes-test-schema/categories/AM1';
// import { createFeatureSelector, createReducer, on } from '@ngrx/store';
//
// const initialState: VehicleDetails = {
//   registrationNumber: '',
// };
//
// export const vehicleDetailsCatCReducer = createReducer(
//   initialState,
//   on(vehicleDetailsActions.VehicleRegistrationChanged, (state, { registrationNumber }): VehicleDetails => ({
//     ...state,
//     registrationNumber,
//   })),
// );
//
// export const vehicleDetailsCatAMod1Reducer = (
//   state: VehicleDetails = initialState,
//   action: vehicleDetailsActions.Types,
// ): VehicleDetails => {
//   switch (action.type) {
//     case vehicleDetailsActions.GEARBOX_CATEGORY_CHANGED:
//       return {
//         ...state,
//         gearboxCategory: action.gearboxCategory,
//       };
//     case vehicleDetailsActions.CLEAR_GEARBOX_CATEGORY:
//       return {
//         ...state,
//         gearboxCategory: null,
//       };
//     case vehicleDetailsActions.SCHOOL_BIKE_TOGGLED:
//       return {
//         ...state,
//         schoolBike: !state.schoolBike,
//       };
//     default:
//       return state;
//   }
// };
//
// export const getVehicleDetails = createFeatureSelector<VehicleDetails>('vehicleDetails');
