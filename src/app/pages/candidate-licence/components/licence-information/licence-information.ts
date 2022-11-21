import { Component, Input } from '@angular/core';
import { DriverLicenceSchema } from '@dvsa/mes-driver-schema';
import { get } from 'lodash';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { SIGNATURE_MOCK } from '@pages/candidate-licence/candidate-licence.mock';

@Component({
  selector: 'licence-information',
  templateUrl: 'licence-information.html',
})
export class LicenceInformation {

  @Input()
  candidateData: DriverLicenceSchema;

  @Input()
  isPracticeMode: boolean;

  @Input()
  bookingDriverNumber: string;

  @Input()
  bookingName: string;

  @Input()
  bookingAge: number;

  @Input()
  bookingGender: string;

  idPrefix = 'candidate-licence-card';

  constructor(private domSanitizer: DomSanitizer) {}

  private displayDateFormat: string = 'DD/MM/YYYY';

  get driverNumber(): string {
    return this.isPracticeMode
      ? this.bookingDriverNumber
      : get(this.candidateData, 'driverStandard.driver.drivingLicenceNumber');
  }

  get name(): string {
    if (this.isPracticeMode) {
      return this.bookingName;
    }
    if (!this.candidateData) {
      return '';
    }

    const firstNames = get(this.candidateData, 'driverStandard.driver.firstNames');
    const lastName = get(this.candidateData, 'driverStandard.driver.lastName');

    return `${firstNames} ${lastName}`;
  }

  get age(): number {
    const dob = get(this.candidateData, 'driverStandard.driver.dateOfBirth');
    const age = moment().diff(dob, 'years');

    return this.isPracticeMode
      ? this.bookingAge
      : age;
  }

  get gender(): string {
    return this.isPracticeMode
      ? this.bookingGender
      : get(this.candidateData, 'driverStandard.driver.gender');
  }

  get cardExpiryDate(): string {
    return this.isPracticeMode
      ? moment().add('5', 'years').format(this.displayDateFormat)
      : moment(get(this.candidateData, 'driverStandard.token.validToDate')).format(this.displayDateFormat);
  }

  get signature(): string {
    if (this.isPracticeMode) {
      const { image, imageFormat } = SIGNATURE_MOCK;
      return this.domSanitizer.bypassSecurityTrustUrl(`data:${imageFormat};base64,${image}`) as string;
    }

    if (!this.candidateData) {
      return '';
    }

    const signature = get(this.candidateData, 'driverSignature.signature.image');
    const signatureFormat = get(this.candidateData, 'driverSignature.signature.imageFormat');

    return this.domSanitizer.bypassSecurityTrustUrl(`data:${signatureFormat};base64,${signature}`) as string;
  }

}
