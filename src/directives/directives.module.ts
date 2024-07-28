import { NgModule } from '@angular/core';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import { CharacterCountDirective } from './character-count.directive';
import { InputRestrictionNumbersDirective } from './input-restriction-numbers.directive';
import { InputRestrictionUppercaseAlphanumDirective } from './input-restriction-uppercasealphanum.directive';

@NgModule({
  declarations: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    AddOrRemoveLangCyDirective,
  ],
  imports: [],
  exports: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    AddOrRemoveLangCyDirective,
  ],
})
export class DirectivesModule {}
