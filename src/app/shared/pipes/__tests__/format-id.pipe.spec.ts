import { FormatIdPipe } from '@shared/pipes/format-id.pipe';

describe('FormatIdPipe', () => {
  let pipe: FormatIdPipe;
  const mockLabel: string = 'Candidate name';
  const mockPrefix: string = 'journal';

  beforeEach(() => {
    pipe = new FormatIdPipe();
  });

  it('should be an instance of the pipe', () => {
    expect(pipe).toBeTruthy();
  });
  it('should not set an id if no value is provided', () => {
    expect(pipe.transform(null)).toEqual(undefined);
  });
  it('should replace any spaces with dashes and append `label`', () => {
    expect(pipe.transform(mockLabel)).toEqual('candidate-name-label');
  });
  it('should replace any spaces with dashes, prefix with page name and append `label`', () => {
    expect(pipe.transform(mockLabel, mockPrefix)).toEqual('journal-candidate-name-label');
  });
  it('should replace any spaces with dashes, prefix with page name and append `value`', () => {
    expect(pipe.transform(mockLabel, mockPrefix, true)).toEqual('journal-candidate-name-value');
  });
});
