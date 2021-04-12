import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ModalController } from '@ionic/angular'; // IonicModule
import { ModalControllerMock, StatusBarMock } from 'ionic-mocks';
import { StatusBar } from '@ionic-native/status-bar';
import { By } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { SecureStorage } from '@ionic-native/secure-storage';
import { SecureStorageMock } from '@ionic-native-mocks/secure-storage';
import { configureTestSuite } from 'ng-bullet';
import { CandidateLinkComponent } from '../candidate-link';
// import { TranslateService } from '@ngx-translate/core';
// import { AppComponent } from '../../../../app/app.component';
import { DataStoreProvider } from '@providers/data-store/data-store';
import { DataStoreProviderMock } from '@providers/data-store/__mocks__/data-store.mock';
// import { CANDIDATE_DETAILS_PAGE } from '../../../../app/pages/page-names.constants'; // FAKE_CANDIDATE_DETAILS_PAGE
/* import { translateServiceMock } from '../../../../app/shared/__mocks__/translate';
import { end2endPracticeSlotId } from '../../../../app/shared/mocks/test-slot-ids.mock';
import { MockAppComponent } from '../../../../app/__mocks__/app.component.mock';
import { bookedTestSlotMock } from '../../../../app/shared/mocks/test-slot-data.mock'; */

class MockStore {
}

xdescribe('CandidateLinkComponent', () => {
  let component: CandidateLinkComponent;
  let fixture: ComponentFixture<CandidateLinkComponent>;

  const modalControllerMock = ModalControllerMock.instance();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      // declarations: [CandidateLinkComponent],
      // imports: [IonicModule.forRoot(CandidateLinkComponent)],
      providers: [
        { provide: StatusBar, useFactory: () => StatusBarMock.instance() },
        { provide: ModalController, useFactory: () => modalControllerMock },
        // { provide: AppComponent, useClass: MockAppComponent },
        { provide: Store, useClass: MockStore },
        { provide: SecureStorage, useClass: SecureStorageMock },
        { provide: DataStoreProvider, useClass: DataStoreProviderMock },
        // { provide: TranslateService, useValue: translateServiceMock },
      ],
    });
  });

  beforeEach(async(() => {
    // fixture = TestBed.createComponent(CandidateLinkComponent);
    component = fixture.componentInstance;
    component.name = { title: '', firstName: '', lastName: '' };
    component.name.title = 'Mr';
    component.name.firstName = 'Joe';
    component.name.lastName = 'Bloggs';
    // component.slot = bookedTestSlotMock;
    component.slotChanged = false;
    component.isPortrait = true;
  }));

  describe('Class', () => {
    describe('openCandidateDetailsModal', () => {
      it('should open CandidateDetailsPage when not in practice mode', () => {
        /* component.openCandidateDetailsModal();
        expect(component.modalController.create).toHaveBeenCalledWith(
          CANDIDATE_DETAILS_PAGE,
          { slot: component.slot, slotChanged: false },
          { cssClass: 'modal-fullscreen text-zoom-regular' },
        ); */
      });
      it('should open FakeCandidateDetailsPage when in practice mode', () => {
        /* component.slot = {
          ...bookedTestSlotMock,
          slotDetail: {
            ...bookedTestSlotMock,
            slotId: `${end2endPracticeSlotId}_1`,
          },
        };
        component.openCandidateDetailsModal();
        expect(component.modalController.create).toHaveBeenCalledWith(
          FAKE_CANDIDATE_DETAILS_PAGE,
          { slot: component.slot, slotChanged: false },
          { cssClass: 'modal-fullscreen text-zoom-regular' },
        ); */
      });
    });
  });

  describe('DOM', () => {
    it('should display candidate name', () => {
      const nameSpan: HTMLElement = fixture.debugElement.query(
        By.css('h3'),
      ).nativeElement;
      fixture.detectChanges();
      expect(nameSpan.textContent).toBe('Mr Joe Bloggs');
    });

    it('should display a right arrow after the candidate name', () => {
      const iconElement = fixture.debugElement.queryAll(
        By.css('ion-icon[name="arrow-forward"]'),
      );
      fixture.detectChanges();
      expect(iconElement.length).toBe(1);
    });

    it('should apply additional css styles if device isPortrait', () => {
      component.isPortrait = true;
      fixture.detectChanges();
      const renderedImages = fixture.debugElement.queryAll(
        By.css('.candidate-name-short'),
      );
      expect(renderedImages.length).toBe(1);
    });

    it('should not apply additional css styles if device isPortrait', () => {
      component.isPortrait = true;
      fixture.detectChanges();
      const renderedImages = fixture.debugElement.queryAll(
        By.css('.candidate-name-long'),
      );
      expect(renderedImages.length).toBe(0);
    });

    it('should apply additional css styles if device isLandscape', () => {
      component.isPortrait = false;
      fixture.detectChanges();
      const renderedImages = fixture.debugElement.queryAll(
        By.css('.candidate-name-long'),
      );
      expect(renderedImages.length).toBe(1);
    });

    it('should not apply additional css styles if device isLandscape', () => {
      component.isPortrait = false;
      fixture.detectChanges();
      const renderedImages = fixture.debugElement.queryAll(
        By.css('.candidate-name-short'),
      );
      expect(renderedImages.length).toBe(0);
    });

    it('should call openCandidateDetailsModal when the main div component is clicked', fakeAsync(() => {
      fixture.detectChanges();
      spyOn(component, 'openCandidateDetailsModal');
      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', null);
      tick();
      fixture.detectChanges();
      expect(component.openCandidateDetailsModal).toHaveBeenCalled();
    }));
  });
});
