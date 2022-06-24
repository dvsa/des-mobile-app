import { createAction } from '@ngrx/store';
import { Identification } from '@dvsa/mes-test-schema/categories/ADI3';

export const IdentificationUsedChanged = createAction(
  '[Test Summary] [CatADIPart3] Identification used changed',
  (identification: Identification) => ({ identification }),
);
