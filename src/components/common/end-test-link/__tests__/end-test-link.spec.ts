import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { configureTestSuite } from 'ng-bullet';
import { Router } from '@angular/router';
import { RouterMock } from '@mocks/angular-mocks/router-mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { AppModule } from '@app/app.module';
import { EndTestLinkComponent } from '../end-test-link';

describe('EndTestLinkComponent', () => {
  let fixture: ComponentFixture<EndTestLinkComponent>;
  let component: EndTestLinkComponent;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EndTestLinkComponent],
      imports: [IonicModule, AppModule],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: Router, useClass: RouterMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(EndTestLinkComponent);
    component = fixture.componentInstance;
  }));

  describe('Class', () => {
    describe('onTerminate', () => {
      beforeEach(() => {
        spyOn(component.routerByCategory, 'navigateToPage');
        component.terminateTestModal = {
          dismiss: () => Promise.resolve(true),
        } as HTMLIonModalElement;
        component.isDelegated = false;
        component.category = TestCategory.BE;
      });
      it('should navigate straight to office when delegated', async () => {
        component.isDelegated = true;
        await component.onTerminate();
        expect(component.routerByCategory.navigateToPage)
          .toHaveBeenCalledWith(TestFlowPageNames.OFFICE_PAGE, TestCategory.BE);
      });
      it('should navigate to debrief page when not delegated', async () => {
        spyOn(component.router, 'navigate');
        await component.onTerminate();
        expect(component.router.navigate)
          .toHaveBeenCalledWith([TestFlowPageNames.DEBRIEF_PAGE]);
      });
    });
  });
});
