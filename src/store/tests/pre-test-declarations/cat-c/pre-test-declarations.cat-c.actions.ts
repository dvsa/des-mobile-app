import { createAction } from '@ngrx/store';

export const ManoeuvresPassCertNumberChanged = createAction(
  '[PreTestDeclarations] Manoeuvres pass certificate number changed',
  (manoeuvrePassCertificateNumber: string) => ({ manoeuvrePassCertificateNumber }),
);
