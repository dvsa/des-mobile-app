import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackButtonEmitter } from '@ionic/angular/common/providers/platform';

@Injectable()
export class PlatformMock extends Platform {
  is = () => false;
  ready = async () => Promise.resolve('');
  backButton: BackButtonEmitter;
}
