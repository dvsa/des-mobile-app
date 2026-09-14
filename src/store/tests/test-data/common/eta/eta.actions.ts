import { createAction } from '@ngrx/store';
import { ExaminerActions } from '../../test-data.constants';

export const ToggleETA = createAction('[Eta] Toggle Eta', (examinerAction: ExaminerActions) => ({ examinerAction }));

export const SteeringControlETAToggled = createAction('[ETA Physical] Steering Control ETA Toggled');

export const HandbrakeETAToggled = createAction('[ETA Physical] Handbrake ETA Toggled');

export const FootbrakeETAToggled = createAction('[ETA Physical] Footbrake ETA Toggled');

export const OtherETAToggled = createAction('[ETA Physical] Other ETA Toggled');

export const ETAPhysicalOtherReasonUpdated = createAction('[ETA Physical] Other Reason Updated', (reason: string) => ({
  reason,
}));
