import { pickBy, endsWith, sumBy } from 'lodash';
import { Manoeuvres, Manoeuvre } from '@dvsa/mes-test-schema/categories/ADI2/partial';
import { ManoeuvreTypes } from '@store/tests/test-data/test-data.constants';
import { CompetencyOutcome } from '../models/competency-outcome';

export const sumManoeuvreFaults = (manoeuvres: Object | Manoeuvres[], faultType: CompetencyOutcome): number => {
  if (!manoeuvres) {
    return 0;
  }

  const inputManoeuvres: Manoeuvres[] = [...(Array.isArray(manoeuvres) ? manoeuvres : [manoeuvres])];
  let manoeuvresCollection: ManoeuvreTypes[] = [];

  return inputManoeuvres.reduce((acc, manoeuvre) => {
    manoeuvresCollection = Object.values(manoeuvre);

    return acc + sumBy<Manoeuvre>(manoeuvresCollection as Manoeuvre[], (manoeuv) => {
      if (manoeuv.selected) {
        const dFkeys = pickBy(manoeuv, (val, key) => endsWith(key, 'Fault') && val === faultType);
        return Object.keys(dFkeys).length;
      }
      return 0;
    });
  }, 0);
};
