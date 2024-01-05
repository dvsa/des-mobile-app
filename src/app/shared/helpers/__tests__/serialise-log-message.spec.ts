import { serialiseLogMessage } from '@shared/helpers/serialise-log-message';

describe('serialiseLogMessage', () => {
  it('should return the string if the data is already a string', () => {
    const res = serialiseLogMessage('test');
    expect(res)
      .toEqual('test');
  });
  it('should return an error that contains the stack, class and information', () => {
    const res = serialiseLogMessage(new Error('test'));
    expect(res)
      .toContain('stack');
    expect(res)
      .toContain('Error');
    expect(res)
      .toContain('test');
  });
  it('should return the stringified data if the data is not a string or an instance of Error', () => {
    const res = serialiseLogMessage({ key: 'value' });
    expect(res)
      .toEqual('{"key":"value"}');
  });
});
