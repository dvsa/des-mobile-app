import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColourContrastService {
  private relativeLuminance(value: number): number {
    const ratio = value / 255;
    return ratio <= 0.04045 ? ratio / 12.92 : Math.pow((ratio + 0.055) / 1.055, 2.4);
  }
  private luminance(color: [number, number, number]): number {
    return 0.2126 * this.relativeLuminance(color[0]) +
      0.7152 * this.relativeLuminance(color[1]) +
      0.0722 * this.relativeLuminance(color[2]);
  }

  private hexToRgb(hex: string): [number, number, number] {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16),
    ] : null;
  }

  getContrastRatio(
    colour1: [number, number, number] | string,
    colour2: [number, number, number] | string = [255, 255, 255],
  ): number {
    if (typeof colour1 === 'string') {
      colour1 = this.hexToRgb(colour1);
    }
    if (typeof colour2 === 'string') {
      colour2 = this.hexToRgb(colour2);
    }
    const luminance1 = this.luminance(colour1);
    const luminance2 = this.luminance(colour2);

    return Number(
      (luminance1 > luminance2 ? (luminance1 + 0.05) / (luminance2 + 0.05) : (luminance2 + 0.05) / (luminance1 + 0.05)
      ).toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]);
  }
}
