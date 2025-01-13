import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, Platform } from '@ionic/angular';
import { StoreModule } from '@ngrx/store';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { RouteByCategoryProviderMock } from '@providers/route-by-category/__mocks__/route-by-category.mock';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;
  let platform: Platform;
  let deviceProvider: DeviceProvider;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [PageHeaderComponent, IonicModule.forRoot(), ComponentsModule, StoreModule.forRoot({})],
      providers: [
        { provide: DeviceProvider, useClass: DeviceProviderMock },
        { provide: RouteByCategoryProvider, useClass: RouteByCategoryProviderMock },
      ],
    });

    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;
    platform = TestBed.inject(Platform);
    deviceProvider = TestBed.inject(DeviceProvider);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit endTestButtonClicked when onEndTestClicked is called', () => {
    spyOn(component.endTestButtonClicked, 'emit');
    component.onEndTestClicked();
    expect(component.endTestButtonClicked.emit).toHaveBeenCalled();
  });

  it('should emit onCloseButtonClicked when onCloseClicked is called', () => {
    spyOn(component.onCloseButtonClicked, 'emit');
    component.onCloseClicked();
    expect(component.onCloseButtonClicked.emit).toHaveBeenCalled();
  });

  it('should emit onExitSAMActivatedChanged with the new value when changeExitSAMValue is called', () => {
    spyOn(component.onExitSAMActivatedChanged, 'emit');
    component.changeExitSAMValue(true);
    expect(component.onExitSAMActivatedChanged.emit).toHaveBeenCalledWith(true);
  });

  it('should subscribe to platform resume event on init', () => {
    spyOn(platform.resume, 'subscribe').and.callThrough();
    component.ngOnInit();
    expect(platform.resume.subscribe).toHaveBeenCalled();
  });

  it('should unsubscribe from platform resume event on destroy', () => {
    spyOn(component.resumeSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.resumeSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should call deviceProvider.enableSingleAppMode when resuming and shouldShowEscapeFromSamButton is true', async () => {
    spyOn(deviceProvider, 'enableSingleAppMode').and.resolveTo();
    component.shouldShowEscapeFromSamButton = true;
    platform.resume.next();
    expect(deviceProvider.enableSingleAppMode).toHaveBeenCalled();
  });
});
