import { FaultSummary } from '@shared/models/fault-marking.model';
import { FaultsDataRowComponent } from '../faults-data-row';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { MobileAccessibility } from '@awesome-cordova-plugins/mobile-accessibility/ngx';

describe('FaultsDataRowComponent', () => {
  describe('defaultSettings', () => {
    it('should have 15 as minDrivingFaultCount when the component is created', () => {
      const component = new FaultsDataRowComponent(new AccessibilityService(new MobileAccessibility()));

      expect(component.minDrivingFaultCount).toBe(15);
    });
  });

  describe('showFaultComment', () => {
    const faultSummary: FaultSummary = {
      competencyIdentifier: 'compId',
      competencyDisplayName: 'dispName',
      faultCount: 2,
      comment: 'comment',
    };

    it('should return false when drivingFaultCount is less than minDrivingFaultCount', () => {
      const component = new FaultsDataRowComponent(new AccessibilityService(new MobileAccessibility()));

      component.drivingFaultCount = 5;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(faultSummary);

      expect(result).toBe(false);
    });

    it('should return false when drivingFaultCount is equal to minDrivingFaultCount', () => {
      const component = new FaultsDataRowComponent(new AccessibilityService(new MobileAccessibility()));

      component.drivingFaultCount = 6;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(faultSummary);

      expect(result).toBe(false);
    });

    it('should return false when there are no comments', () => {
      const localFaultSummary = {
        ...faultSummary,
        comment: undefined,
      };
      const component = new FaultsDataRowComponent(new AccessibilityService(new MobileAccessibility()));

      component.drivingFaultCount = 7;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(localFaultSummary);

      expect(result).toBe(false);
    });

    it('should return true when drivingFaultCount is greater than minDrivingFaultCount and has comments', () => {
      const component = new FaultsDataRowComponent(new AccessibilityService(new MobileAccessibility()));

      component.drivingFaultCount = 7;
      component.minDrivingFaultCount = 6;

      const result = component.showFaultComment(faultSummary);

      expect(result).toBe(true);
    });
  });

  describe('getDriverType', () => {
    it('should return riding when isRider is true', () => {
      const component = new FaultsDataRowComponent(new AccessibilityService(new MobileAccessibility()));
      expect(component.getDriverType(true)).toBe('riding');
    });

    it('should return driving when isRider is false', () => {
      const component = new FaultsDataRowComponent(new AccessibilityService(new MobileAccessibility()));
      expect(component.getDriverType(false)).toBe('driving');
    });
  });
});
