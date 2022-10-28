import { Injectable } from '@angular/core';
import { AppComponent } from '@app/app.component';

@Injectable({
  providedIn: 'root',
})
export class ColSizeService {

  constructor(public appComponent: AppComponent) {
  }

  public getColSize(): string {
    switch (this.appComponent.getTextZoomClass()) {
      case 'text-zoom-x-large':
        return '40';
      default:
        return '44';
    }
  }
}
