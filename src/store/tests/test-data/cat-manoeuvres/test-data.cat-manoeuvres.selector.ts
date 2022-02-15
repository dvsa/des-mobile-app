import { CatCMUniqueTypes } from '@dvsa/mes-test-schema/categories/CM';

export const getManoeuvres = (data: CatCMUniqueTypes.TestData): CatCMUniqueTypes.Manoeuvres => data.manoeuvres;
