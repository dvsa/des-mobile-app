import { TestCentre } from '@dvsa/mes-test-schema/categories/common';
import { TestSlot } from '@dvsa/mes-journal-schema';
import { get } from 'lodash';

export const getCostCentre = (testCentre: TestCentre) => testCentre.costCode || '';

export const extractTestCentre = (slotData: TestSlot): TestCentre => {
  return {
    centreId: get(slotData, 'testCentre.centreId', null),
    costCode: get(slotData, 'testCentre.costCode', null),
    centreName: get(slotData, 'testCentre.centreName', null),
  };
};
