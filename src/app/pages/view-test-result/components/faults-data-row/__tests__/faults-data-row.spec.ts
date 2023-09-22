import { FaultSummary } from '@shared/models/fault-marking.model';
import { FaultsDataRowComponent } from '../faults-data-row';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { DangerousFaultBadgeComponent } from '@components/common/dangerous-fault-badge/dangerous-fault-badge';
import { SeriousFaultBadgeComponent } from '@components/common/serious-fault-badge/serious-fault-badge';
import { DrivingFaultsBadgeComponent } from '@components/common/driving-faults-badge/driving-faults-badge';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';

describe('FaultsDataRowComponent', () => {
  let fixture: ComponentFixture<FaultsDataRowComponent>;
  let component: FaultsDataRowComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaultsDataRowComponent,
        MockComponent(DangerousFaultBadgeComponent),
        MockComponent(SeriousFaultBadgeComponent),
        MockComponent(DrivingFaultsBadgeComponent),
      ],
      imports: [
        IonicModule,
        ComponentsModule,
      ],
      providers: [
        {
          provide: AccessibilityService,
          useClass: AccessibilityServiceMock,
        },
      ],
    });

    fixture = TestBed.createComponent(FaultsDataRowComponent);
    component = fixture.componentInstance;
  }));

  describe('showFaultComment', () => {
    const faultSummary: FaultSummary = {
      competencyIdentifier: 'compId',
      competencyDisplayName: 'dispName',
      faultCount: 2,
      comment: 'comment',
    };

    it('should return false when drivingFaultCount is less than minDrivingFaultCount', () => {
      component.drivingFaultCount = 5;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(faultSummary);

      expect(result)
        .toBe(false);
    });

    it('should return false when drivingFaultCount is equal to minDrivingFaultCount', () => {
      component.drivingFaultCount = 6;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(faultSummary);

      expect(result)
        .toBe(false);
    });

    it('should return false when there are no comments', () => {
      const localFaultSummary = {
        ...faultSummary,
        comment: null,
      };

      component.drivingFaultCount = 7;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(localFaultSummary);

      expect(result)
        .toBe(false);
    });

    it('should return true when drivingFaultCount is greater than minDrivingFaultCount and has comments', () => {
      component.drivingFaultCount = 7;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(faultSummary);

      expect(result)
        .toBe(true);
    });
  });

  describe('getDriverType', () => {
    it('should return riding when isRider is true', () => {
      expect(component.getDriverType(true))
        .toBe('riding');
    });

    it('should return driving when isRider is false', () => {
      expect(component.getDriverType(false))
        .toBe('driving');
    });
  });
});
