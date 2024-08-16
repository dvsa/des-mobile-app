import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { isEqual } from 'lodash-es';

export type PassedData = [string, number, string];

@Component({
  selector: 'data-grid',
  templateUrl: 'data-grid.html',
  styleUrls: ['data-grid.scss'],
})
export class DataGridComponent implements OnInit {
  @Input() headers: string[] = null;
  @Input() passedData: any[][] = null;
  @Input() colourScheme: string[] = null;
  @Input() displayColour = false;
  @Input() showSeparator = true;
  @Input() showHeaders = true;
  @Input() padDataTable = false;

  public finalColourArray: string[] = null;

  constructor(public accessibilityService: AccessibilityService) {}

  /**
   * Lifecycle hook that is called after Angular has initialized all data-bound properties of a directive.
   *
   * It checks if `colourScheme` is set and `finalColourArray` is not initialized,
   * then it calls the `loopColours` method to set the final colour array.
   */
  ngOnInit() {
    if (this.colourScheme && !this.finalColourArray) {
      this.finalColourArray = this.loopColours();
    }
  }

  /**
   * Lifecycle hook that is called when any data-bound property of a directive changes.
   *
   * This method checks if any of the properties in `changes` have different current and previous values.
   * If the `colourScheme` property is included in the changes or any data-bound property has changed,
   * it updates the `finalColourArray` by calling the `loopColours` method.
   * If any data-bound property has changed and both `rowCropCount` and `passedData` are set,
   * it calls the `cropData` method to update the cropped data.
   *
   * @param {SimpleChanges} changes - An object of key/value pairs for the set of changed properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    const dataChanged = Object.keys(changes).some(
      (key) => !isEqual(changes[key]?.currentValue, changes[key]?.previousValue)
    );

    if (Object.keys(changes).includes('colourScheme') || dataChanged) {
      this.finalColourArray = this.loopColours();
    }
  }

  /**
   * Generates an array of colours by repeating the `colourScheme`
   * array enough times to cover the length of `passedData`.
   *
   * This method calculates how many times the `colourScheme` array needs to be repeated to match
   * or exceed the length of `passedData`.
   * It then creates a new array by repeating the `colourScheme` array the required number of times and
   * flattens the result into a single array.
   *
   * @returns {string[]} An array of colours repeated to match the length of `passedData`.
   */
  loopColours(): string[] {
    const loopCount = Math.ceil(this.passedData.length / this.colourScheme.length);

    return Array(loopCount)
      .fill(() => null)
      .flatMap(() => this.colourScheme);
  }

  /**
   * TrackBy function for ngFor to improve performance by tracking items by their index.
   *
   * This method returns the index of the item, which Angular uses to track the identity of items in the list.
   *
   * @param {number} index - The index of the item in the list.
   * @returns {number} The index of the item.
   */
  trackByIndex = (index: number): number => index;
}
