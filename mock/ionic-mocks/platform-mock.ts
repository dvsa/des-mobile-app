import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { BackButtonEmitter } from '@ionic/angular/providers/platform';

@Injectable()
export class PlatformMock extends Platform {
  is = () => false;
  ready = async() => Promise.resolve('');
  backButton: BackButtonEmitter;
}
