import { transformStringForID } from '@shared/helpers/transform-string-for-id';

describe('transformStringForId', () => {
  it('should replace spaces with hyphens and convert to lowercase', () => {
    expect(transformStringForID('John Doe')).toBe('john-doe');
  });

  it('should handle multiple spaces', () => {
    expect(transformStringForID('Jane   Smith')).toBe('jane-smith');
  });
});
