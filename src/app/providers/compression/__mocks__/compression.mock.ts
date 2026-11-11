import { vi } from 'vitest';
export class CompressionProviderMock {
  extract = vi.fn().mockReturnValue({ data: 'mockedData' });

  compress = vi.fn().mockReturnValue('mockedCompressedData');
}
