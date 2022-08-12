import { Component, Input } from '@angular/core';
import { get } from 'lodash';
import {
  Accompaniment,
  TestSummary,
  PassCompletion,
  CommunicationPreferences, CategoryCode,
} from '@dvsa/mes-test-schema/categories/common';
import { TestSummary as CatAMod2TestSummary } from '@dvsa/mes-test-schema/categories/AM2';
import { flattenArray, convertBooleanToString } from '../../view-test-result-helpers';

@Component({
  selector: 'test-summary-card',
  templateUrl: 'test-summary-card.html',
})
export class TestSummaryCardComponent {

  @Input()
  accompaniment: Accompaniment;

  @Input()
  passCompletion: PassCompletion;

  @Input()
  testSummary: TestSummary | CatAMod2TestSummary;

  @Input()
  communicationPreferences: CommunicationPreferences;

  @Input()
  category?: CategoryCode;

  public get accompaniedBy() : string {
    const accompaniedBy: string[] = [];

    if (get(this.accompaniment, 'ADI')) {
      accompaniedBy.push('ADI');
    }
    if (get(this.accompaniment, 'interpreter')) {
      accompaniedBy.push('Interpreter');
    }
    if (get(this.accompaniment, 'supervisor')) {
      accompaniedBy.push('Supervisor');
    }
    if (get(this.accompaniment, 'trainer')) {
      accompaniedBy.push('Trainer');
    }
    if (get(this.accompaniment, 'other')) {
      accompaniedBy.push('Other');
    }
    if (accompaniedBy.length === 0) {
      accompaniedBy.push('None');
    }

    return flattenArray(accompaniedBy);
  }

  public get provisionalLicenceProvided() : string {
    return convertBooleanToString(get(this.passCompletion, 'provisionalLicenceProvided'));
  }

  public get code78(): string {
    const code78: boolean = get(this.passCompletion, 'code78Present', null);
    return code78 !== null ? convertBooleanToString(code78) : null;
  }

  public get passCertificateNumber() : string {
    return get(this.passCompletion, 'passCertificateNumber');
  }

  public get routeNumber(): number | 'None' {
    return get(this.testSummary, 'routeNumber', 'None');
  }

  public get independentDriving() : string {
    return get(this.testSummary, 'independentDriving', 'None');
  }

  public get trueLikenessToPhoto() : boolean {
    return get(this.testSummary, 'trueLikenessToPhoto', false);
  }

  public get candidateDescription(): string {
    return get(this.testSummary, 'candidateDescription', 'None');
  }

  public get debriefWitnessed(): string {
    return convertBooleanToString(get(this.testSummary, 'debriefWitnessed'));
  }

  public get weatherConditions() : string {
    const weatherConditions: string[] = get(this.testSummary, 'weatherConditions', []);
    return flattenArray((weatherConditions?.length > 0) ? weatherConditions : ['None']);
  }

  public get d255() : string {
    return convertBooleanToString(get(this.testSummary, 'D255'));
  }

  public get additionalInformation() : string {
    return get(this.testSummary, 'additionalInformation', 'None');
  }

  public shouldDisplayLicenceProvided() : boolean {
    return get(this.passCompletion, 'provisionalLicenceProvided') !== undefined;
  }

  public shouldDisplayTestConductedOn() : boolean {
    return get(this.testSummary, 'modeOfTransport') !== undefined;
  }

  public get testConductedOn(): string {
    return get(this.testSummary, 'modeOfTransport', 'None');
  }

  public get conductedLanguage(): string {
    return get(this.communicationPreferences, 'conductedLanguage', 'None');
  }

  isADI3() {
    return this.category === 'ADI3';
  }
}
