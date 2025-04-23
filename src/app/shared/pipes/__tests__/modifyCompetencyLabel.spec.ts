import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModifyCompetencyLabel } from '../modifyCompetencyLabel';

describe('ModifyCompetencyLabel', () => {
  let pipe: ModifyCompetencyLabel;

  beforeEach(() => {
    pipe = new ModifyCompetencyLabel();
  });

  describe('transform', () => {
    it('returns "move away" when test category includes "EUA" and fault contains "MOVEOFF"', () => {
      const result = pipe.transform('move off', 'EUA1' as TestCategory, 'move off');
      expect(result).toBe('move away');
    });

    it('returns "Emergency Stop" when test category is in the emergency list and fault contains "CONTROLLEDSTOP"', () => {
      const result = pipe.transform('Controlled Stop', TestCategory.B, 'controlled stop');
      expect(result).toBe('Emergency Stop');
    });

    it('returns the original value when test category does not include "EUA" and fault does not contain "MOVEOFF"', () => {
      const result = pipe.transform('move off', TestCategory.B, 'some other fault');
      expect(result).toBe('move off');
    });

    it('returns the original value when test category is not in the emergency list and fault contains "CONTROLLEDSTOP"', () => {
      const result = pipe.transform('Controlled Stop', TestCategory.C, 'controlled stop');
      expect(result).toBe('Controlled Stop');
    });

    it('handles empty fault string gracefully and returns the original value', () => {
      const result = pipe.transform('move off', TestCategory.EUAM1 as TestCategory, '');
      expect(result).toBe('move off');
    });

    it('handles null test category gracefully and returns the original value', () => {
      const result = pipe.transform('move off', null as unknown as TestCategory, 'move off');
      expect(result).toBe('move off');
    });

    it('handles undefined fault gracefully and returns the original value', () => {
      const result = pipe.transform('Controlled Stop', TestCategory.B, undefined as unknown as string);
      expect(result).toBe('Controlled Stop');
    });

    it('is case insensitive when matching fault strings', () => {
      const result = pipe.transform('Controlled Stop', TestCategory.B, 'CONTROLLEDSTOP');
      expect(result).toBe('Emergency Stop');
    });

    it('ignores whitespace in fault strings when matching', () => {
      const result = pipe.transform('Controlled Stop', TestCategory.B, '  controlled   stop  ');
      expect(result).toBe('Emergency Stop');
    });
  });

  describe('shouldDisplayEmergencyLabel', () => {
    it('returns true when category is in the emergency list', () => {
      const result = pipe.shouldDisplayEmergencyLabel(TestCategory.B);
      expect(result).toBe(true);
    });

    it('returns false when category is not in the emergency list', () => {
      const result = pipe.shouldDisplayEmergencyLabel(TestCategory.C);
      expect(result).toBe(false);
    });

    it('handles null category gracefully and returns false', () => {
      const result = pipe.shouldDisplayEmergencyLabel(null as unknown as TestCategory);
      expect(result).toBe(false);
    });

    it('handles undefined category gracefully and returns false', () => {
      const result = pipe.shouldDisplayEmergencyLabel(undefined as unknown as TestCategory);
      expect(result).toBe(false);
    });
  });
});
