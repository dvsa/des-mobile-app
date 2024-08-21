import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
//Many of the values used appear arbitrary, but they are not,
// a full explanation can be found here https://mallonbacka.com/blog/2023/03/wcag-contrast-formula/
export class ColourContrastService {
  relativeLuminance(value: number): number {
    //convert value from between 0 and 255 to between 0 and 1
    const ratio = value / 255;
    //return the relative luminance of the colour passed
    return ratio <= 0.04045 ? ratio / 12.92 : Math.pow((ratio + 0.055) / 1.055, 2.4);
  }
  luminance([colour1, colour2, colour3]: [number, number, number]): number {
    //return luminance value for the passed colour
    return (
      0.2126 * this.relativeLuminance(colour1) +
      0.7152 * this.relativeLuminance(colour2) +
      0.0722 * this.relativeLuminance(colour3)
    );
  }
  hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [Number.parseInt(result[1], 16), Number.parseInt(result[2], 16), Number.parseInt(result[3], 16)]
      : null;
  }

  getContrastRatio(
    colour1: [number, number, number] | string,
    colour2: [number, number, number] | string = [255, 255, 255]
  ): number {
    if (typeof colour1 === 'string') {
      colour1 = this.hexToRgb(colour1);
    }
    if (typeof colour2 === 'string') {
      colour2 = this.hexToRgb(colour2);
    }
    const luminance1 = this.luminance(colour1);
    const luminance2 = this.luminance(colour2);

    // calculate contrast using (L1 + 0.05) / (L2 + 0.05), where l1 is the largest of the 2 l values, return as a number
    // with zero decimal places, but without rounding.
    return Number(
      (luminance1 > luminance2 ? (luminance1 + 0.05) / (luminance2 + 0.05) : (luminance2 + 0.05) / (luminance1 + 0.05))
        .toString()
        .match(/^-?\d+(?:\.\d{0,2})?/)[0]
    );
  }
}
