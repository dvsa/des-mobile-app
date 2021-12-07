import { EllipsisPipe } from '@shared/pipes/ellipsis.pipe';

describe('EllipsisPipe', () => {
  let pipe: EllipsisPipe;
  const someText: string = 'Some text being displayed in template';

  beforeEach(() => {
    pipe = new EllipsisPipe();
  });

  it('should be an instance of the pipe', () => {
    expect(pipe).toBeTruthy();
  });
  it('should not trim function if not a string', () => {
    expect(pipe.transform(null)).toEqual(undefined);
  });
  it('should truncate text and add ellipsis after default of 25', () => {
    expect(pipe.transform(someText)).toEqual('Some text being displayed in...');
  });
  it('should truncate text and add ellipsis when input is less than truncateAt', () => {
    expect(pipe.transform(someText, 8)).toEqual('Some text...');
  });
  it('should return original when input length is less than truncateAt value', () => {
    expect(pipe.transform(someText, 50)).toEqual(someText);
  });
});
