import { Injectable } from '@angular/core';
import { DriverLicenceSchema, DriverPhotograph, DriverSignature, DriverStandard } from '@dvsa/mes-driver-schema';
import { DriverLicenceDetails } from '@providers/candidate-licence/candidate-licence';
import { Observable } from 'rxjs';

@Injectable()
export class CandidateLicenceProviderMock {
  private requestError: string;
  private driverLicenceResponse: DriverLicenceDetails;

  clearDriverData(): void {
  }

  getCandidateData(): Observable<DriverLicenceSchema> {
    return undefined;
  }

  private getDriverPhoto(): Observable<DriverPhotograph> {
    return undefined;
  }

  private getDriverSignature(): Observable<DriverSignature> {
    return undefined;
  }

  private getDriverStandardData(): Observable<DriverStandard> {
    return undefined;
  }

}

export const mockDriverPhoto = { photograph: { image: 'some pic img' } } as DriverPhotograph;
export const mockDriverSignature = { signature: { image: 'some sig img' } } as DriverSignature;
export const mockDriverStandard = { driver: {} } as DriverStandard;
