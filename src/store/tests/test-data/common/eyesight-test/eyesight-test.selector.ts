import { EyesightTest } from '@dvsa/mes-test-schema/categories/common';

export const hasEyesightTestGotSeriousFault = (data: EyesightTest) => data.seriousFault;
export const hasEyesightTestBeenCompleted = (data: EyesightTest) => data.complete;
