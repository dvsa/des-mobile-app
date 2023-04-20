import { isAnyOf } from '@shared/helpers/simplifiers';
import { OrientationType } from '@capawesome/capacitor-screen-orientation/dist/esm/definitions';

export const isPortrait = (type: OrientationType) => isAnyOf(type, [
  OrientationType.PORTRAIT,
  OrientationType.PORTRAIT_PRIMARY,
  OrientationType.PORTRAIT_SECONDARY,
]);
