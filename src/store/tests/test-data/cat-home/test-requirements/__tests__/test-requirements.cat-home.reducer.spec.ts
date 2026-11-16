import { ToggleLegalRequirement } from '@store/tests/test-data/common/test-requirements/test-requirements.actions';
import { LegalRequirements } from '@store/tests/test-data/test-data.constants';
import { describe, expect, it } from 'vitest';
import { testRequirementsCatHomeReducer } from '../test-requirements.cat-home.reducer';

describe('testRequirementsCatHomeReducer', () => {
  it('should toggle legalRequirement on ToggleLegalRequirement action', () => {
    const result = testRequirementsCatHomeReducer({}, ToggleLegalRequirement(LegalRequirements.angledStart));
    expect(result.angledStart).toBe(true);
  });
});
