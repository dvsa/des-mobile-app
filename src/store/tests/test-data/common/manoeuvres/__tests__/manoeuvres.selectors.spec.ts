import { ManoeuvreUnion } from '../../../../../../shared/unions/test-schema-unions';
import { getReverseLeftSelected } from '../../../common/manoeuvres/manoeuvres.selectors';

describe('Manoeuvres Selectors', () => {
  describe('getReverseLeftSelected', () => {
    it('should return true when reverse left is selected', () => {
      const manoeuvres: ManoeuvreUnion = {
        reverseLeft: {
          selected: true,
        },
      };
      const result = getReverseLeftSelected(manoeuvres);
      expect(result).toBeTruthy();
    });

    it('should return false when reverse left is not selected', () => {
      const manoeuvres: ManoeuvreUnion = {
        reverseLeft: {
          selected: false,
        },
      };
      const result = getReverseLeftSelected(manoeuvres);
      expect(result).toBeFalsy();
    });

    it('should return false when reverse left is undefined', () => {
      const manoeuvres: ManoeuvreUnion = {
        reverseLeft: undefined,
      };
      const result = getReverseLeftSelected(manoeuvres);
      expect(result).toBeFalsy();
    });
  });
});
