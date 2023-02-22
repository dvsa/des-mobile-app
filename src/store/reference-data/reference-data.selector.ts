import { RefDataStateModel } from '@store/reference-data/reference-data.reducer';
import { RefDataTestCentreResponse } from '@providers/reference-data/reference-data';

export const getLastUpdatedDate = (refData: RefDataStateModel) => refData.dateLoaded;
export const getTestCentres = (refData: RefDataStateModel) => refData.testCentres;
export const getActiveTestCentres = (testCentres: RefDataTestCentreResponse) => testCentres?.active;
export const getInactiveTestCentres = (testCentres: RefDataTestCentreResponse) => testCentres?.inactive;
