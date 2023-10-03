import { NgModule } from '@angular/core';
import { InputRestrictionNumbersDirective } from './input-restriction-numbers.directive';
import { InputRestrictionUppercaseAlphanumDirective } from './input-restriction-uppercasealphanum.directive';
import { CharacterCountDirective } from './character-count.directive';
import { InputRestrictionNoEmojiDirective } from '@directives/input-restriction-noEmojis.directive';

@NgModule({
  declarations: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
    InputRestrictionNoEmojiDirective,
  ],
  imports: [],
  exports: [
    InputRestrictionNoEmojiDirective,
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
  ],
})
export class DirectivesModule { }
