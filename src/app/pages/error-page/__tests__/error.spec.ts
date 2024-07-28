import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorMessageComponent } from '@components/common/error-message/error-message';
import { AlertController, IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ActivatedRouteMock, AlertControllerMock, NavParamsMock, RouterMock } from '@mocks/index.mock';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { AuthenticationProviderMock } from '@providers/authentication/__mocks__/authentication.mock';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { MockComponent } from 'ng-mocks';
import { ErrorPage } from '../error';

describe('ErrorPage', () => {
	let fixture: ComponentFixture<ErrorPage>;
	let component: ErrorPage;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ErrorPage, MockComponent(ErrorMessageComponent)],
			imports: [IonicModule],
			providers: [
				{
					provide: Router,
					useClass: RouterMock,
				},
				{
					provide: NavParams,
					useClass: NavParamsMock,
				},
				{
					provide: ModalController,
					useClass: ModalControllerMock,
				},
				{
					provide: AlertController,
					useClass: AlertControllerMock,
				},
				{
					provide: AuthenticationProvider,
					useClass: AuthenticationProviderMock,
				},
				{
					provide: DeviceProvider,
					useClass: DeviceProviderMock,
				},
				{
					provide: ActivatedRoute,
					useClass: ActivatedRouteMock,
				},
				{
					provide: LogHelper,
					useClass: LogHelperMock,
				},
				provideMockStore(),
			],
		});

		fixture = TestBed.createComponent(ErrorPage);
		component = fixture.componentInstance;
	}));

	describe('dismiss', () => {
		it('should dismiss open modal', fakeAsync(async () => {
			spyOn(component.modalController, 'dismiss');
			await component.dismiss();
			expect(component.modalController.dismiss).toHaveBeenCalled();
		}));
	});

	describe('DOM', () => {
		it('should display an error message', () => {
			expect(fixture.debugElement.query(By.css('.error'))).not.toBeNull();
		});
	});
});
