import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { AppModule } from '@app/app.module';
import { StoreModel } from '@shared/models/store.model';
import { EndTestLinkComponent } from '../end-test-link';

describe('EndTestLinkComponent', () => {
  let fixture: ComponentFixture<EndTestLinkComponent>;
  let component: EndTestLinkComponent;
  let store$: Store<StoreModel>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EndTestLinkComponent],
      imports: [
        IonicModule,
        AppModule,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: Router, useClass: RouterMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(EndTestLinkComponent);
    component = fixture.componentInstance;
    store$ = TestBed.inject(Store);

    spyOn(component.routerByCategory, 'navigateToPage');
    spyOn(component.router, 'navigate');
    spyOn(store$, 'dispatch');
  }));

  describe('Class', () => {
    describe('onTerminate', () => {
      beforeEach(() => {
        component.terminateTestModal = { dismiss: async () => true } as HTMLIonModalElement;
        component.category = TestCategory.BE;
      });
      it('should navigate straight to office when delegated', async () => {
        component.isDelegated = true;
        await component.onTerminate();
        expect(component.routerByCategory.navigateToPage)
          .toHaveBeenCalledWith(TestFlowPageNames.OFFICE_PAGE, TestCategory.BE);
      });
      it('should navigate to debrief page when not delegated', async () => {
        component.isDelegated = false;
        await component.onTerminate();
        expect(component.router.navigate).toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
      });
    });
  });
});
