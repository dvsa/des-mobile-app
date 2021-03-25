import { Observable } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, filter, map,
} from 'rxjs/operators';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'typeahead-dropdown',
  templateUrl: 'typeahead-dropdown.html',
})
export class TypeaheadDropdownComponent {
  model: any;

  @Input()
  listValues: object[];

  @Input()
  property: string;

  formatter = (state: object) => state[this.property];

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((term) => term.length >= 2),
    map((term) => this.listValues.filter((state) => new RegExp(term, 'mi').test(state[this.property])).slice(0, 10)),
  );

}
