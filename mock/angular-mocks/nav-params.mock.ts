import { Injectable } from '@angular/core';
import { NavParams } from '@ionic/angular';

@Injectable()
export class NavParamsMock extends NavParams {
  get<T>(param: string): T {
    return super.get(param);
  }
}
