import { Circuit } from '@dvsa/mes-test-schema/categories/AM1';
import { createAction } from '@ngrx/store';

export const CircuitTypeChanged = createAction(
  '[Test Summary] [CatAMod1] Circuit type changed',
  (circuitType: Circuit) => ({ circuitType })
);
