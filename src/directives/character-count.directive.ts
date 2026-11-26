/**
 * Return the remaining character count from an input field
 *
 * The `charLimit` property defines the UTF-8 byte count used to calculate the
 * remaining count. The optional numeric `hardLimit` caps user input in UTF-8
 * bytes; it may differ from `charLimit`, and zero is a valid limit.
 *
 * Without `hardLimit`, values can exceed `charLimit` and the emitted count can
 * be negative. Hard-limit enforcement applies to native inputs and textareas;
 * it does not truncate initial or programmatically assigned values.
 *
 * ### Example
 *
 * ```typescript
 * @Component({
 *   selector: 'person-description',
 *   templateUrl: `
 *     <textarea charCount [charLimit]="10" [hardLimit]="10" [value]="description"
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
import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[charCount]',
  host: {
    '(input)': 'onInput($event)',
    '(ionChange)': 'onIonChange($event)',
  },
})
export class CharacterCountDirective implements AfterViewInit, OnDestroy {
  @Input() charLimit: number = null;
  @Input() hardLimit: number = null;

  @Output() onCharacterCountChanged: EventEmitter<number> = new EventEmitter(true);
  $event: Event;
  // Keep the text and selection from before an edit so a limit does not remove
  // unrelated text after the caret. Selection offsets are UTF-16 indices.
  private edit: { value: string; start: number; end: number } = null;
  // IME input can generate several intermediate input events for one edit.
  private composing = false;
  private compositionCommitted = false;
  private readonly limitEvents = ['beforeinput', 'paste', 'input', 'compositionstart', 'compositionend'] as const;

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
    const element = this.el.nativeElement;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      // Capture-phase input handling corrects the DOM value before Angular's
      // form value accessor and the character-count input listener read it.
      // Register regardless of the initial hardLimit so later input changes work.
      for (const event of this.limitEvents) element.addEventListener(event, this.enforceHardLimit, true);
    }
    const valueLength = this.el.nativeElement.value || '';
    const byteLength = this.getUtf8ByteLength(valueLength);
    if (this.charLimit != null) {
      this.onCharacterCountChanged.emit(this.charLimit - byteLength);
    }
  }

  ngOnDestroy(): void {
    const element = this.el.nativeElement;
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      // These native capture listeners are not removed by Angular automatically.
      for (const event of this.limitEvents) element.removeEventListener(event, this.enforceHardLimit, true);
    }
  }

  private enforceHardLimit = (event: Event): void => {
    // A null limit disables enforcement; discard any pending edit state as well.
    if (this.hardLimit == null) {
      this.edit = null;
      this.composing = false;
      this.compositionCommitted = false;
      return;
    }
    const element: HTMLInputElement | HTMLTextAreaElement = this.el.nativeElement;
    // A final composition beforeinput belongs to the existing selection, not a new edit.
    if (
      this.compositionCommitted &&
      event.type === 'beforeinput' &&
      event instanceof InputEvent &&
      (event.inputType === 'insertCompositionText' || event.inputType === 'insertFromComposition')
    ) {
      return;
    }
    // Capture paste separately: the paste sanitiser inserts text programmatically
    // and dispatches input without a preceding browser beforeinput event.
    if (
      event.type === 'compositionstart' ||
      ((event.type === 'beforeinput' || event.type === 'paste') && !this.composing)
    ) {
      this.compositionCommitted = false;
      this.edit = {
        value: element.value,
        // Non-selectable inputs expose null selection offsets; treat them as a
        // replacement of the whole value.
        start: element.selectionStart ?? 0,
        end: element.selectionEnd ?? element.value.length,
      };
      if (event.type === 'compositionstart') this.composing = true;
    } else if (event.type === 'compositionend') {
      // Leave intermediate composition text alone, then enforce once it commits.
      this.composing = false;
      this.limitInput(element);
      this.compositionCommitted = true;
      // Composition can finish without another input event for the counter.
      this.handleChange(element.value);
    } else if (event.type === 'input' && !this.composing) {
      // Reuse the original selection if the browser supplies a final input.
      this.limitInput(element);
      this.edit = null;
      this.compositionCommitted = false;
    }
  };

  private limitInput(element: HTMLInputElement | HTMLTextAreaElement): void {
    const value = element.value;
    if (this.getUtf8ByteLength(value) <= this.hardLimit) return;
    const edit = this.edit;
    // Previously saved values can already exceed the limit. Allow a user to
    // reduce them incrementally rather than deleting the rest of their text.
    if (edit && this.getUtf8ByteLength(value) < this.getUtf8ByteLength(edit.value)) return;
    // The selection separates the original value into text that must be kept
    // before and after the inserted or replacement text.
    const before = edit?.value.slice(0, edit.start) ?? '';
    const after = edit?.value.slice(edit.end) ?? '';
    // If the change cannot be reconciled with the saved selection, restore it
    // rather than guessing which existing text the user intended to replace.
    if (edit && (!value.startsWith(before) || !value.endsWith(after) || value.length < before.length + after.length)) {
      element.value = edit.value;
      if (element.selectionStart !== null) element.setSelectionRange(edit.start, edit.end);
      return;
    }
    const inserted = value.slice(before.length, value.length - after.length);
    let accepted = '';
    // Iterating by Unicode code point avoids splitting surrogate pairs.
    // Count both preserved sides so the full result stays within the byte limit.
    for (const character of inserted) {
      if (this.getUtf8ByteLength(before + accepted + character + after) > this.hardLimit) break;
      accepted += character;
    }
    // If none of the replacement fits, keep the selected text instead of
    // deleting it. Otherwise retain as much of the insertion as fits.
    element.value = edit && inserted && !accepted ? edit.value : before + accepted + after;
    if (edit && element.selectionStart !== null) {
      // Restore the selection on rejection; otherwise place the caret after the
      // accepted text. Without a saved edit, truncation starts at the beginning.
      if (element.value === edit.value) element.setSelectionRange(edit.start, edit.end);
      else element.setSelectionRange(before.length + accepted.length, before.length + accepted.length);
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
  onInput(event: { target: { value: string } }) {
    const inputElement = event.target;
    this.handleChange(inputElement.value);
  }

  /**
   * Handles the ionChange event for the input field.
   *
   * This method is triggered when the ionChange event occurs on the input field.
   * It delegates the handling of the event to the handleChange method.
   *
   * @param event - The event object containing the new value of the input field.
   */
  onIonChange(event: { target: { value: string } }) {
    const inputElement = event.target as HTMLInputElement;
    this.handleChange(inputElement.value);
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
