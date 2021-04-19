import { createAction } from '@ngrx/store';
import { ModeOfTransport } from '@dvsa/mes-test-schema/categories/AM2';

export const ModeOfTransportChanged = createAction(
  '[Test Summary] [CatAMod2] Mode of transport changed',
  (modeOfTransport: ModeOfTransport) => ({ modeOfTransport }),
);
