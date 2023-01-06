import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideMockStore } from '@ngrx/store/testing';
import { TypeaheadDropdownComponent } from '@components/common/typeahead-dropdown/typeahead-dropdown';

describe('TypeaheadDropdownComponent', () => {
  let fixture: ComponentFixture<TypeaheadDropdownComponent>;
  let component: TypeaheadDropdownComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
      providers: [
        provideMockStore({ ...{} }),

      ],
    });

    fixture = TestBed.createComponent(TypeaheadDropdownComponent);
    component = fixture.componentInstance;
  }));

  describe('clearInput', () => {
    it('should set model to null', () => {
      component.clearInput();

      expect(component.model)
        .toBe(null);
    });
  });
});
