import { TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CanCommunicationDeactivateGuard } from '@pages/communication/can-communication-deactivate';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { CommunicationPage } from '@pages/communication/communication.page';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('CanCommunicationDeactivateGuard', () => {
  let component: CanCommunicationDeactivateGuard;

  let comPage: CommunicationPage;
  let currentRoute: ActivatedRouteSnapshot;
  let currentState: RouterStateSnapshot;
  let nextState: RouterStateSnapshot;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
      ],
      providers: [
        CanCommunicationDeactivateGuard,
      ],
    });

    component = TestBed.inject(CanCommunicationDeactivateGuard);
  }));

  describe('canDeactivate', () => {
    it('should call canDeActivate if url is CANDIDATE_LICENCE_PAGE', async () => {
      comPage = { async canDeActivate(): Promise<boolean> { return true; } } as CommunicationPage;
      nextState = { url: TestFlowPageNames.CANDIDATE_LICENCE_PAGE } as RouterStateSnapshot;
      spyOn(comPage, 'canDeActivate');
      component.canDeactivate(comPage, currentRoute, currentState, nextState);
      expect(comPage.canDeActivate).toHaveBeenCalled();
    });
    it('should return if url is not CANDIDATE_LICENCE_PAGE', async () => {
      nextState = { url: null } as RouterStateSnapshot;
      expect(component.canDeactivate(comPage, currentRoute, currentState, nextState)).toEqual(true);
    });
  });
});
