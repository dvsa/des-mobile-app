import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { beforeEach, describe, expect, it } from 'vitest';

import { AlternateEvidenceProvidedComponent } from '@pages/office/components/alternate-mot-evidence-provided/alternate-evidence-provided.component';
import { DrivingFaultsComponent as DrivingFaultsComponent_1 } from '@pages/office/components/driving-faults/driving-faults.component';
import { ECOCardComponent } from '@pages/office/components/eco-card/eco-card.component';
import { ETACardComponent } from '@pages/office/components/eta-card/eta-card.component';
import { ETAPhysicalTypeComponent } from '@pages/office/components/eta-physical-type/eta-physical-type';
import { FinishTestModal } from '@pages/office/components/finish-test-modal/finish-test-modal';
import { OfficeFooterComponent } from '@pages/office/components/office-footer/office-footer.component';
import { TrueLikenessComponent } from '@pages/office/components/true-likeness/true-likeness';
import { FaultSummary } from '@shared/models/fault-marking.model';
import { AdditionalInformationComponent } from '../../additional-information/additional-information';
import { AlternateEvidenceDescriptionComponent } from '../../alternate-mot-evidence-description/alternate-evidence-description.component';
import { CandidateDescriptionComponent } from '../../candidate-description/candidate-description';
import { CandidateSectionComponent } from '../../candidate-section/candidate-section';
import { DateOfTest } from '../../date-of-test/date-of-test';
import { FaultCommentCardComponent } from '../../fault-comment-card/fault-comment-card';
import { FaultCommentComponent } from '../../fault-comment/fault-comment';
import { IdentificationComponent } from '../../identification/identification';
import { IndependentDrivingComponent } from '../../independent-driving/independent-driving';
import { RouteNumberComponent } from '../../route-number/route-number';
import { ShowMeQuestionComponent } from '../../show-me-question/show-me-question';
import { VehicleChecksOfficeCardComponent } from '../../vehicle-checks/vehicle-checks-office-card';
import { WeatherConditionsComponent } from '../../weather-conditions/weather-conditions';
import { DrivingFaultsComponent } from '../driving-faults.component';

describe('DrivingFaultsComponent', () => {
  let component: DrivingFaultsComponent;
  let fixture: ComponentFixture<DrivingFaultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        OfficeFooterComponent,
        FaultCommentComponent,
        FaultCommentCardComponent,
        RouteNumberComponent,
        CandidateDescriptionComponent,
        IdentificationComponent,
        IndependentDrivingComponent,
        ShowMeQuestionComponent,
        WeatherConditionsComponent,
        AdditionalInformationComponent,
        VehicleChecksOfficeCardComponent,
        CandidateSectionComponent,
        DateOfTest,
        FinishTestModal,
        TrueLikenessComponent,
        ECOCardComponent,
        DrivingFaultsComponent_1,
        ETACardComponent,
        AlternateEvidenceDescriptionComponent,
        AlternateEvidenceProvidedComponent,
        ETAPhysicalTypeComponent,
        DrivingFaultsComponent,
      ],
    });

    fixture = TestBed.createComponent(DrivingFaultsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('DOM', () => {
    const drivingFaults: FaultSummary[] = [
      {
        competencyIdentifier: 'signalsTimed',
        competencyDisplayName: 'Signals - Timed',
        faultCount: 3,
        comment: 'dummy',
      },
      {
        competencyIdentifier: 'useOfSpeed',
        competencyDisplayName: 'Use of speed',
        faultCount: 1,
        comment: 'dummy',
      },
    ];
    describe('Driving Faults Overview', () => {
      it('should display a driving faults badge with the count for each type of driving fault on the test', () => {
        component.faults = drivingFaults;
        fixture.detectChanges();
        const drivingFaultBadges = fixture.debugElement.queryAll(By.css('driving-faults-badge'));
        expect(drivingFaultBadges.length).toBe(2);
        expect(drivingFaultBadges[0].componentInstance.count).toBe(3);
        expect(drivingFaultBadges[1].componentInstance.count).toBe(1);
      });
      it('should render the display name for each driving fault', () => {
        component.faults = drivingFaults;
        fixture.detectChanges();
        const faultLabels = fixture.debugElement.queryAll(By.css('.fault-label'));
        expect(faultLabels.length).toBe(2);
        expect(faultLabels[0].nativeElement.innerHTML).toBe('Signals - Timed');
        expect(faultLabels[1].nativeElement.innerHTML).toBe('Use of speed');
      });
    });
  });
});
