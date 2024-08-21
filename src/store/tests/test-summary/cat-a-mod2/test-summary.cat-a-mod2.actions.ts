import { ModeOfTransport } from '@dvsa/mes-test-schema/categories/AM2';
import { createAction } from '@ngrx/store';

export const ModeOfTransportChanged = createAction(
  '[Test Summary] [CatAMod2] Mode of transport changed',
  (modeOfTransport: ModeOfTransport) => ({ modeOfTransport })
);
