import { Observable } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, filter, map,
} from 'rxjs/operators';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'typeahead-dropdown',
  templateUrl: 'typeahead-dropdown.html',
  styleUrls: ['typeahead-dropdown.scss'],
})
export class TypeaheadDropdownComponent {
  model: any;

  @Input()
  listValues: object[];

  @Input()
  property: string;

  @Output()
  candidateChange = new EventEmitter<string>();

  formatter = (state: object) => state[this.property];

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((term) => term.length >= 3),
    map((term) => this.listValues.filter((state) => new RegExp(term, 'mi').test(state[this.property])).slice(0, 10)),
  );

  onModelChanged(value) {
    this.candidateChange.emit(value);
  }

}
