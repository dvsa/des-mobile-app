import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  SearchablePicklistModalEvent,
} from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { SearchablePicklistModal } from '@components/common/searchable-picklist-modal/searchable-picklist-modal';

describe('SearchablePicklistModal', () => {
  let fixture: ComponentFixture<SearchablePicklistModal<any>>;
  let component: SearchablePicklistModal<any>;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchablePicklistModal,
      ],
      imports: [
        IonicModule,
        PipesModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
      ],
    });

    fixture = TestBed.createComponent(SearchablePicklistModal<any>);
    component = fixture.componentInstance;

    modalController = TestBed.inject(ModalController);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('isActiveSelection', () => {
      beforeEach(() => {
        component.model = { age: 25, hairColour: 'brown' };
        component.primaryKey = 'age';
      });
      it('should return true when primary key value matches in both input and value of model', () => {
        expect(component.isActiveSelection({ age: 25, hairColour: 'blonde' })).toEqual(true);
      });
      it('should return false when primary key value does not match in both input and value of model', () => {
        expect(component.isActiveSelection({ age: 63, hairColour: 'brown' })).toEqual(false);
      });
    });
    describe('trackBy', () => {
      it('should return given property of object based on primaryKey', () => {
        component.primaryKey = 'id';
        expect(component.trackBy(null, { id: 1, place: 'Wales' })).toEqual(1);
      });
    });
    describe('conditionalStyles', () => {
      it('should return an object with booleans set against each property', () => {
        spyOn(component, 'isActiveSelection').and.returnValue(false);
        expect(component.conditionalStyles(null)).toEqual({
          selected: false,
          'button-style': true,
        });
      });
    });
    describe('get hasEnteredSufficientCharacters', () => {
      beforeEach(() => {
        component.searchedValue = 'some value';
      });
      it('should return true when searchedValue is greater or equal to minCharactersBeforeListDisplay', () => {
        component.minCharactersBeforeListDisplay = 3;
        expect(component.hasEnteredSufficientCharacters).toEqual(true);
      });
      it('should return false if searchedValue is not greater or equal to minCharactersBeforeListDisplay', () => {
        component.minCharactersBeforeListDisplay = 30;
        expect(component.hasEnteredSufficientCharacters).toEqual(false);
      });
    });
    describe('onSearchbarChange', () => {
      beforeEach(() => {
        component.searchedValue = null;
      });
      it('should not set the value of searchedValue when no value set', () => {
        component.onSearchbarChange({} as CustomEvent);
        expect(component.searchedValue).toEqual(null);
      });
      it('should not set the value of searchedValue when value is empty', () => {
        component.onSearchbarChange({
          detail: { value: '' },
        } as CustomEvent);
        expect(component.searchedValue).toEqual(null);
      });
      it('should set the value of searchedValue when defined', () => {
        component.onSearchbarChange({
          detail: { value: 'some value' },
        } as CustomEvent);
        expect(component.searchedValue).toEqual('some value');
      });
    });
    describe('onClick', () => {
      it('should call modal dismiss with data and role', async () => {
        spyOn(modalController, 'dismiss').and.returnValue(Promise.resolve(true));
        await component.onClick('data');
        expect(modalController.dismiss).toHaveBeenCalledWith('data', SearchablePicklistModalEvent.SUBMIT);
      });
    });
    describe('onSearchbarClear', () => {
      it('should set searchedValue to null', () => {
        component.onSearchbarClear();
        expect(component.searchedValue).toEqual(null);
      });
    });
  });
});
