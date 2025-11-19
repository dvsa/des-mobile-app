export class CompressionProviderMock {
  extract = jasmine.createSpy('extract').and.returnValue({ data: 'mockedData' });

  compress = jasmine.createSpy('compress').and.returnValue('mockedCompressedData');
}
