import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class StorageMock {
  clear = jasmine.createSpy('clear').and.resolveTo();

  create = jasmine.createSpy('create').and.resolveTo({} as Storage);

  get = jasmine.createSpy('get').and.resolveTo('storage data');

  keys = jasmine.createSpy('keys').and.resolveTo(['key1', 'key2']);

  remove = jasmine.createSpy('remove').and.resolveTo();

  set = jasmine.createSpy('set').and.resolveTo();
}
