import { createAction, props } from '@ngrx/store';
import { LegalRequirements } from '../../test-data.constants';

export const ToggleLegalRequirement = createAction(
  '[Legal Requirements] Toggle Legal Requirement',
  props<{ payload: LegalRequirements }>(),
);
