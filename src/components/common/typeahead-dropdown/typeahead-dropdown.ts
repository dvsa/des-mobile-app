import { Observable } from 'rxjs';
import {
  debounceTime, distinctUntilChanged, filter, map,
} from 'rxjs/operators';
import {
  Component, Input, Output, EventEmitter,
} from '@angular/core';

enum TypeaheadFail {
  NO_RESULTS = 'No results',
}

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
  candidateChange = new EventEmitter();

  formatter = (state: object) => state[this.property];

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((term) => term.length >= 3),
    map((term) => this.listValues.filter((state) => new RegExp(term, 'mi').test(state[this.property])).slice(0, 10)),
    map((list) => list.length === 0 ? [{ [this.property]: TypeaheadFail.NO_RESULTS }] : list),
  );

  onModelChanged(value) {
    if (value && value[this.property] === TypeaheadFail.NO_RESULTS) {
      value = null;
    }
    this.candidateChange.emit(value);
  }

  clearInput() {
    this.model = null;
  }

}
