import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  SearchablePicklistComponentWrapper,
} from '@components/common/searchable-picklist-wrapper/searchable-picklist-wrapper';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { AppConfigProvider } from '@providers/app-config/app-config';
import { AppConfigProviderMock } from '@providers/app-config/__mocks__/app-config.mock';

describe('SearchablePicklistComponentWrapper', () => {
  let fixture: ComponentFixture<SearchablePicklistComponentWrapper<any>>;
  let component: SearchablePicklistComponentWrapper<any>;
  let modalController: ModalController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchablePicklistComponentWrapper,
      ],
      imports: [
        IonicModule,
        PipesModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: AppConfigProvider, useClass: AppConfigProviderMock },
      ],
    });

    fixture = TestBed.createComponent(SearchablePicklistComponentWrapper<any>);
    component = fixture.componentInstance;

    modalController = TestBed.inject(ModalController);
    component.disabled = false;

    spyOn(component.outputChanged, 'emit');
    spyOn(modalController, 'create').and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      dismiss: () => Promise.resolve(true),
      onWillDismiss: () => Promise.resolve({ data: 'will dismiss data' }),
    } as HTMLIonModalElement));
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Class', () => {
    describe('openModal', () => {
      it('should not call the modal create if disable is set to true', async () => {
        component.disabled = true;
        await component.openModal();
        expect(modalController.create).not.toHaveBeenCalled();
      });
      it('should not call the modal create if getTop is defined', async () => {
        spyOn(modalController, 'getTop').and.returnValue(Promise.resolve({} as HTMLIonModalElement));
        component.disabled = false;
        await component.openModal();
        expect(modalController.create).not.toHaveBeenCalled();
      });
      it('should call through when disable not set and no modal currently exists', async () => {
        spyOn(modalController, 'getTop').and.returnValue(Promise.resolve(undefined));
        component.disabled = false;
        await component.openModal();
        expect(modalController.create).toHaveBeenCalled();
        expect(component.outputChanged.emit).toHaveBeenCalledWith('will dismiss data');
      });
    });
    describe('clearInput', () => {
      it('should set model and searchedValue to null', () => {
        component.clearInput();
        expect(component.model).toEqual(null);
        expect(component.searchedValue).toEqual(null);
      });
    });
  });
});
