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

  ngAfterViewInit() {
    const valueLength = this.el.nativeElement.value || '';
    const byteLength = this.getUtf8ByteLength(valueLength);
    if (this.charLimit) {
      this.onCharacterCountChanged.emit(this.charLimit - byteLength);
    }
  }

  onInput(e: any) {
    const value = e.target.value;
    const byteLength = this.getUtf8ByteLength(value);

    if (!this.charLimit || value === undefined) return;

    // Emit the remaining character count minus the byte count of the character entered
    this.onCharacterCountChanged.emit(this.charLimit - byteLength);
  }

  onIonChange(e: any) {
    const value = e.value || '';
    const byteLength = this.getUtf8ByteLength(value);

    if (!this.charLimit || value === undefined) return;

    // Emit the remaining character count minus the byte count of the character entered
    this.onCharacterCountChanged.emit(this.charLimit - byteLength);
  }

  /**
   * Get the byte length of a string
   *
   * @param input - The string to calculate the byte length of
   * @returns The byte length of the input
   *
   */
  getUtf8ByteLength(input: string): number {
    // Using TextEncoder to get the byte length
    const encoder = new TextEncoder();
    const encoded = encoder.encode(input);
    return encoded.length;
  }
}
