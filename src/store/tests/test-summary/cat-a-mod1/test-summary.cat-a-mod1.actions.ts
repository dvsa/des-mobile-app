import { createAction } from '@ngrx/store';
import { Circuit } from '@dvsa/mes-test-schema/categories/AM1';

export const CircuitTypeChanged = createAction(
  '[Test Summary] [CatAMod1] Circuit type changed',
  (circuitType: Circuit) => ({ circuitType }),
)
