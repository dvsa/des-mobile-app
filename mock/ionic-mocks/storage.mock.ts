import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable()
export class StorageMock {

  clear = jasmine.createSpy('clear')
    .and
    .returnValue(Promise.resolve());

  create = jasmine.createSpy('create')
    .and
    .returnValue(Promise.resolve({} as Storage));

  get = jasmine.createSpy('get')
    .and
    .returnValue(Promise.resolve('storage data'));

  keys = jasmine.createSpy('keys')
    .and
    .returnValue(Promise.resolve(['key1', 'key2']));

  remove = jasmine.createSpy('remove')
    .and
    .returnValue(Promise.resolve());

  set = jasmine.createSpy('set')
    .and
    .returnValue(Promise.resolve());

}
