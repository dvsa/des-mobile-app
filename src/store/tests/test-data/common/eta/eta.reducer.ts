import { ETA } from '@dvsa/mes-test-schema/categories/common';
import { createReducer, on } from '@ngrx/store';
import * as etaActions from './eta.actions';

export const initialState: ETA = {};

export const etaReducer = createReducer(
  initialState,
  on(etaActions.ToggleETA, (state, { examinerAction }) => ({
    ...state,
    [examinerAction]: !state[examinerAction],
  })),
  on(
    etaActions.FootbrakeETAToggled,
    (state): ETA => ({
      ...state,
      physicalType: {
        ...(state.physicalType ?? {}),
        footbrake: state?.physicalType?.footbrake ? undefined : true,
      },
    })
  ),
  on(
    etaActions.HandbrakeETAToggled,
    (state): ETA => ({
      ...state,
      physicalType: {
        ...(state.physicalType ?? {}),
        handbrake: state?.physicalType?.handbrake ? undefined : true,
      },
    })
  ),
  on(etaActions.OtherETAToggled, (state): ETA => {
    const isTurningOff = !!state?.physicalType?.other;
    return {
      ...state,
      physicalType: {
        ...(state.physicalType ?? {}),
        other: isTurningOff ? undefined : true,
        otherText: isTurningOff ? undefined : state?.physicalType?.otherText,
      },
    };
  }),
  on(etaActions.ETAPhysicalOtherReasonUpdated, (state, { reason }): ETA => {
    const trimmedReason = (reason ?? '').trim();
    return {
      ...state,
      physicalType: {
        ...(state.physicalType ?? {}),
        otherText: trimmedReason === '' ? undefined : trimmedReason,
      },
    };
  }),
  on(
    etaActions.SteeringControlETAToggled,
    (state): ETA => ({
      ...state,
      physicalType: {
        ...(state.physicalType ?? {}),
        steeringControl: state?.physicalType?.steeringControl ? undefined : true,
      },
    })
  )
);
