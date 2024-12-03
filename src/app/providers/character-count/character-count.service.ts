import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CharacterCountService {
  /**
   * Return the appropriate string based upon the number of characters remaining
   * @param charactersRemaining
   */
  getCharacterCountText(charactersRemaining: number): string {
    const characterString = Math.abs(charactersRemaining) === 1 ? 'character' : 'characters';
    const endString = charactersRemaining < 0 ? 'too many' : 'remaining';
    return `You have ${Math.abs(charactersRemaining)} ${characterString} ${endString}`;
  }

  /**
   * Check if the number of characters remaining is negative
   * @param charactersRemaining
   */
  charactersExceeded(charactersRemaining: number): boolean {
    return charactersRemaining < 0;
  }
}
