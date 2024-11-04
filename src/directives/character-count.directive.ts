/**
 * Return the remaining character count from an input field
 *
 * The `charLimit` property defines the maximum number of characters for the field
 *
 * ### Example
 *
 * ```typescript
 * @Component({
 *   selector: 'person-description',
 *   templateUrl: `
 *     <textarea charCount charLimit="10" [value]="description"
 *       (onCharacterCountChanged)="characterCountChanged($event)"
 *       (change)="descriptionChanged($event.target.value)">
 *     <div class="character-count">{{getCharacterCountText}}</div>
 *   `
 * })
 * export class PersonDescriptionComponent {
 *   descriptionCharactersRemaining: number = null;
 *
 *   constructor() {}
 *
 *   characterCountChanged(charactersRemaining: number) {
 *     this.descriptionCharactersRemaining = charactersRemaining;
 *  }
 *   getCharacterCountText() {
 *     const characterString = Math.abs(this.descriptionCharactersRemaining) === 1 ? 'character' : 'characters';
 *     const endString = this.descriptionCharactersRemaining >= 0 ? 'remaining' : 'too many';
 *     return `You have ${Math.abs(this.descriptionCharactersRemaining)} ${characterString} ${endString}`;
 *   }
 * }
 * ```
 *
 * */
import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[charCount]',
  host: {
    '(input)': 'onInput($event)',
    '(ionChange)': 'onIonChange($event)',
  },
})
export class CharacterCountDirective implements AfterViewInit {
  private charLimit: number = null;

  @Output() onCharacterCountChanged: any = new EventEmitter(true);

  constructor(public el: ElementRef) {
    this.charLimit = this.el.nativeElement.getAttribute('charLimit');
  }

  /**
   * Lifecycle hook that is called after a component's view has been fully initialized.
   *
   * This method calculates the remaining character count based on the initial value
   * of the input field and emits the result through the `onCharacterCountChanged` event.
   */
  ngAfterViewInit() {
    const valueLength = this.el.nativeElement.value || '';
    const byteLength = this.getUtf8ByteLength(valueLength);
    if (this.charLimit) {
      this.onCharacterCountChanged.emit(this.charLimit - byteLength);
    }
  }

  /**
   * Handles the input event for the input field.
   *
   * This method is triggered when the input event occurs on the input field.
   * It delegates the handling of the event to the handleChange method.
   *
   * @param event - The event object containing the new value of the input field.
   */
  onInput(event: any) {
    this.handleChange(event.target.value);
  }

  /**
   * Handles the ionChange event for the input field.
   *
   * This method is triggered when the ionChange event occurs on the input field.
   * It delegates the handling of the event to the handleChange method.
   *
   * @param event - The event object containing the new value of the input field.
   */
  onIonChange(event: any) {
    this.handleChange(event.target.value);
  }

  /**
   * Handles the change event for the input field.
   *
   * This method calculates the remaining character count based on the UTF-8 byte length
   * of the input value and emits the result through the `onCharacterCountChanged` event.
   *
   * @param value - The current value of the input field.
   */
  handleChange(value: string) {
    if (this.charLimit !== null && value !== undefined) {
      const byteLength = this.getUtf8ByteLength(value);
      this.onCharacterCountChanged.emit(this.charLimit - byteLength);
    }
  }

  /**
   * Get the byte length of a string
   *
   * @param input - The string to calculate the byte length of
   * @returns The byte length of the input
   *
   */
  getUtf8ByteLength(input: string): number {
    if (input === null) return 0;
    // Using TextEncoder to get the byte length
    return new TextEncoder().encode(input).length;
  }
}
