import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { TextZoom } from '@capacitor/text-zoom';

@Injectable({
  providedIn: 'root',
})
export class AccessibilityService {
  textZoom = 100;

  private decimalToPercentage = (decimal: number) => decimal * 100;

  configureAccessibility = async (): Promise<void> => {
    const { value } = await TextZoom.getPreferred();
    this.getTextZoomCallback(this.decimalToPercentage(value));
  };

  afterAppResume = async (): Promise<void> => {
    const { value } = await TextZoom.getPreferred();
    this.getTextZoomCallback(this.decimalToPercentage(value));
  };

  configureStatusBar = async (style: Style): Promise<void> => {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      await StatusBar.setStyle({ style: style });
    }
  };

  getTextZoomCallback = (zoomLevel: number) => {
    // Default iOS zoom levels are: 88%, 94%, 100%, 106%, 119%, 131%, 144% - 106% is default / normal zoom for ipad
    this.textZoom = zoomLevel;
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
