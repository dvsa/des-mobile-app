import { NgModule } from '@angular/core';
import { InputRestrictionNumbersDirective } from './input-restriction-numbers.directive';
import { InputRestrictionUppercaseAlphanumDirective } from './input-restriction-uppercasealphanum.directive';
import { CharacterCountDirective } from './character-count.directive';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import { LanguageSetDirective } from '@directives/language-set.directive';

@NgModule({
  declarations: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    LanguageSetDirective
  ],
  imports: [],
  exports: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    LanguageSetDirective
  ],
})
export class DirectivesModule { }
