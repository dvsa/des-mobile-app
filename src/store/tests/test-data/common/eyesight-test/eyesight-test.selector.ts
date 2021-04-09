import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';

export const hasEyesightTestGotSeriousFault = (data: EyesightTest): boolean => data.seriousFault;
export const hasEyesightTestBeenCompleted = (data: EyesightTest): boolean => data.complete;
