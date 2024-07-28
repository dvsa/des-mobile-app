import { Injectable } from '@angular/core';
import { RefDataTestCentreResponse } from '@providers/reference-data/reference-data';
import { of } from 'rxjs';

@Injectable()
export class ReferenceDataProviderMock {
	public getTestCentres = () => of({} as RefDataTestCentreResponse);
}
