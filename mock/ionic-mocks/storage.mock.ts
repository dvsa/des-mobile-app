import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { vi } from 'vitest';

@Injectable()
export class StorageMock {
  clear = vi.fn().mockResolvedValue(undefined);

  defineDriver = vi.fn().mockResolvedValue(undefined);

  create = vi.fn().mockResolvedValue({} as Storage);

  get = vi.fn().mockResolvedValue('storage data');

  keys = vi.fn().mockResolvedValue(['key1', 'key2']);

  remove = vi.fn().mockResolvedValue(undefined);

  set = vi.fn().mockResolvedValue(undefined);
}
