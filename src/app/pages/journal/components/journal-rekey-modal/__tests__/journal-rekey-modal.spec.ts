import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import { ModalControllerMock, NavParamsMock } from '@mocks/index.mock';
import { DeviceProviderMock } from '@providers/device/__mocks__/device.mock';
import { DeviceProvider } from '@providers/device/device';
import { LogHelperMock } from '@providers/logs/__mocks__/logs-helper.mock';
import { LogHelper } from '@providers/logs/logs-helper';
import { JournalRekeyModal } from '../journal-rekey-modal';
import { ModalEvent } from '../journal-rekey-modal.constants';

describe('JournalRekeyModal', () => {
	let fixture: ComponentFixture<JournalRekeyModal>;
	let component: JournalRekeyModal;
	let modalController: ModalController;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [JournalRekeyModal],
			imports: [IonicModule, ComponentsModule],
			providers: [
				{ provide: NavParams, useClass: NavParamsMock },
				{ provide: ModalController, useClass: ModalControllerMock },
				{ provide: DeviceProvider, useClass: DeviceProviderMock },
				{ provide: LogHelper, useClass: LogHelperMock },
			],
		});

		fixture = TestBed.createComponent(JournalRekeyModal);
		modalController = TestBed.inject(ModalController);
		component = fixture.componentInstance;
	}));

	describe('DOM', () => {
		it('should call onStartTest when the Start test button is clicked', () => {
			fixture.detectChanges();
			spyOn(component, 'onStartTest');
			const button = fixture.debugElement.query(By.css('ion-button.start-test-button'));
			button.triggerEventHandler('click', null);

			fixture.detectChanges();
			expect(component.onStartTest).toHaveBeenCalled();
		});

		it('should call onRekeyTest when the Rekey a paper test button is clicked', () => {
			fixture.detectChanges();
			spyOn(component, 'onRekeyTest');
			const button = fixture.debugElement.query(By.css('ion-button.rekey-test-button'));
			button.triggerEventHandler('click', null);

			fixture.detectChanges();
			expect(component.onRekeyTest).toHaveBeenCalled();
		});

		it('should call onCancel when the Cancel button is clicked', () => {
			fixture.detectChanges();
			spyOn(component, 'onCancel');
			const button = fixture.debugElement.query(By.css('ion-button.cancel-button'));
			button.triggerEventHandler('click', null);

			fixture.detectChanges();
			expect(component.onCancel).toHaveBeenCalled();
		});
	});

	describe('onCancel', () => {
		it('should call dismiss with CANCEL', async () => {
			spyOn(modalController, 'dismiss');
			await component.onCancel();
			expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.CANCEL);
		});
	});
	describe('onStartTest', () => {
		it('should call dismiss with START', async () => {
			spyOn(modalController, 'dismiss');
			await component.onStartTest();
			expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.START);
		});
	});
	describe('onRekeyTest', () => {
		it('should call dismiss with REKEY', async () => {
			spyOn(modalController, 'dismiss');
			await component.onRekeyTest();
			expect(await modalController.dismiss).toHaveBeenCalledWith(ModalEvent.REKEY);
		});
	});
});
