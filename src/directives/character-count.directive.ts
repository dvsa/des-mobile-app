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
 **/
import { Directive, Output, ElementRef, EventEmitter, AfterViewInit } from '@angular/core';

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
    const valueLength = this.el.nativeElement.value ? this.el.nativeElement.value.length : 0;
    if (this.charLimit) {
      this.onCharacterCountChanged.emit(this.charLimit - valueLength);
    }
  }

  onInput(e: any) {
    if (!this.charLimit || e.target.value === undefined) return;
    this.onCharacterCountChanged.emit(this.charLimit - e.target.value.length);
  }

  onIonChange(e: any) {
    if (!this.charLimit || e.value === undefined) return;
    this.onCharacterCountChanged.emit(this.charLimit - e.value.length);
  }
}
