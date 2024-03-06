import { NgModule } from '@angular/core';
import { InputRestrictionNumbersDirective } from './input-restriction-numbers.directive';
import { InputRestrictionUppercaseAlphanumDirective } from './input-restriction-uppercasealphanum.directive';
import { CharacterCountDirective } from './character-count.directive';
import { EmojiBlockDirective } from '@directives/emoji-block.directive';
import { PasteSanitiserDirective } from '@directives/paste-sanitiser';
import { AddOrRemoveLangCyDirective } from '@directives/add-or-remove-lang-cy.directive';

@NgModule({
  declarations: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    AddOrRemoveLangCyDirective
  ],
  imports: [],
  exports: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
    EmojiBlockDirective,
    PasteSanitiserDirective,
    AddOrRemoveLangCyDirective
  ],
})
export class DirectivesModule { }
