import { TestBed } from '@angular/core/testing';
import { LoadingController } from '@ionic/angular';
import { configureTestSuite } from 'ng-bullet';

// import { LoadingControllerMock } from '@mocks/ionic-mocks/loading-controller.mock';
import { LoadingProvider } from '../loading-provider.service';

xdescribe('LoadingProvider', () => {
  let service: LoadingProvider;
  // let loadingCtrl: LoadingController;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        LoadingProvider,
        // { provide: LoadingController, useClass: LoadingControllerMock },
      ],
    });
  });

  beforeEach(() => {
    // loadingCtrl = TestBed.inject(LoadingController);
    // spyOn(loadingCtrl, 'create').and.returnValue(Promise.resolve({
    //   present: async () => {},
    //   dismiss: async () => { return true; },
    // } as HTMLIonLoadingElement));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleUILoading', () => {
    it('should call the create method when isLoading is true', async () => {
      // await service.handleUILoading(true);
      // expect(loadingCtrl.create).toHaveBeenCalledWith({ spinner: 'circles' });
    });
    // it('should call create with custom option when isLoading is true', async () => {
    //   await service.handleUILoading(true, { spinner: 'bubbles' });
    //   expect(loadingCtrl.create).toHaveBeenCalledWith({ spinner: 'bubbles' });
    // });
    // it('should not call create when isLoading is false', async () => {
    //   await service.handleUILoading(false);
    //   expect(loadingCtrl.create).not.toHaveBeenCalled();
    // });
    // it('should call getTop for each spinner that exists in order to dismiss them', async () => {
    //   spyOn(loadingCtrl, 'getTop').and.returnValues(
    //     Promise.resolve({ id: '1' } as HTMLIonLoadingElement),
    //     Promise.resolve({ id: '2' } as HTMLIonLoadingElement),
    //   );
    //   await service.handleUILoading(false);
    //   expect(loadingCtrl.create).not.toHaveBeenCalled();
    //   expect(loadingCtrl.getTop).toHaveBeenCalledTimes(2);
    // });
  });

});
