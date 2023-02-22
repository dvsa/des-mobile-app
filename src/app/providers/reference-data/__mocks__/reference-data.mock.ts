import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { RefDataTestCentreResponse } from '@providers/reference-data/reference-data';

@Injectable()
export class ReferenceDataProviderMock {
  public getTestCentres = () => of({} as RefDataTestCentreResponse);

}
