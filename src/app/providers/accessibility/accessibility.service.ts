import { Injectable } from '@angular/core';
import { MobileAccessibility } from '@awesome-cordova-plugins/mobile-accessibility/ngx';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  textZoom: number = 100;

  constructor(private mobileAccessibility: MobileAccessibility) {
  }

  configureAccessibility = async (): Promise<void> => {
    this.mobileAccessibility.updateTextZoom();
    this.getTextZoomCallback(await this.mobileAccessibility.getTextZoom());
  };

  afterAppResume = async (): Promise<void> => {
    this.mobileAccessibility.usePreferredTextZoom(true);
    this.getTextZoomCallback(await this.mobileAccessibility.getTextZoom());
  };

  getTextZoomCallback = (zoomLevel: number): void => {
    // Default iOS zoom levels are: 88%, 94%, 100%, 106%, 119%, 131%, 144% - 106% is default / normal zoom for ipad
    this.textZoom = zoomLevel;
    this.mobileAccessibility.usePreferredTextZoom(false);
  };

  public getTextZoom(zoom: number): string {
    if (!zoom) return 'regular';
    if (zoom >= 131) return 'x-large';
    if (zoom >= 106) return 'large';
    return 'regular';
  }

  public getTextZoomClass(): string {
    return `text-zoom-${this.getTextZoom(this.textZoom)}`;
  }
}
