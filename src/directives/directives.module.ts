import { NgModule } from '@angular/core';
import { InputRestrictionNumbersDirective } from './input-restriction-numbers.directive';
import { InputRestrictionUppercaseAlphanumDirective } from './input-restriction-uppercasealphanum.directive';
import { CharacterCountDirective } from './character-count.directive';

@NgModule({
  declarations: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
  ],
  imports: [],
  exports: [
    InputRestrictionNumbersDirective,
    InputRestrictionUppercaseAlphanumDirective,
    CharacterCountDirective,
  ],
})
export class DirectivesModule { }
