import { Action } from '@ngrx/store';

export const CBT_NUMBER_CHANGED = '[PreTestDeclarations] [CatA] CBT Number Changed';

export class CbtNumberChanged implements Action {
  readonly type = CBT_NUMBER_CHANGED;
  constructor(public cbtNumber: string) { }
}

export type Types =
  | CbtNumberChanged;
