import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core';
import { ModalControllerMock } from '@mocks/ionic-mocks/modal-controller.mock';
import { Store, StoreModule } from '@ngrx/store';
import { ReverseDiagramPage } from '@pages/test-report/components/reverse-diagram-modal/reverse-diagram-modal';
import { AccessibilityServiceMock } from '@providers/accessibility/__mocks__/accessibility-service.mock';
import { AccessibilityService } from '@providers/accessibility/accessibility.service';
import { StoreModel } from '@shared/models/store.model';
import { testReportReducer } from '../../../test-report.reducer';
import { ReverseDiagramClosed, ReverseDiagramOpened } from '../../reverse-diagram-modal/reverse-diagram-modal.actions';
import { ReverseDiagramLinkComponent } from '../reverse-diagram-link';

describe('ReverseDiagramLinkComponent', () => {
  let fixture: ComponentFixture<ReverseDiagramLinkComponent>;
  let component: ReverseDiagramLinkComponent;
  let modalController: ModalController;
  let store$: Store<StoreModel>;
  let accessibilityService: AccessibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          tests: () => ({
            currentTest: {
              slotId: '123',
            },
            testStatus: {},
            startedTests: {
              123: {
                category: TestCategory.D, // Value will be overridden where necessary
                vehicleDetails: {
                  vehicleLength: 10,
                  vehicleWidth: 2.75,
                },
                accompaniment: {},
                testData: {
                  dangerousFaults: {},
                  drivingFaults: {},
                  manoeuvres: {},
                  seriousFaults: {},
                  testRequirements: {},
                  ETA: {},
                  eco: {},
                  vehicleChecks: {
                    showMeQuestions: [
                      {
                        code: 'S3',
                        description: '',
                        outcome: '',
                      },
                    ],
                    tellMeQuestions: [
                      {
                        code: '',
                        description: '',
                        outcome: '',
                      },
                    ],
                  },
                  eyesightTest: {},
                },
                activityCode: '28',
                journalData: {
                  candidate: {
                    candidateName: 'Joe Bloggs',
                    driverNumber: '123',
                  },
                },
                rekey: false,
              },
            },
          }),
          testReport: testReportReducer,
        }),
        ReverseDiagramLinkComponent,
      ],
      providers: [
        { provide: ModalController, useClass: ModalControllerMock },
        { provide: AccessibilityService, useClass: AccessibilityServiceMock },
      ],
    });

    fixture = TestBed.createComponent(ReverseDiagramLinkComponent);
    component = fixture.componentInstance;
    modalController = TestBed.inject(ModalController);
    store$ = TestBed.inject(Store);
    accessibilityService = TestBed.inject(AccessibilityService);

    vi.spyOn(store$, 'dispatch').mockReturnValue(undefined);
    vi.spyOn(modalController, 'create').mockReturnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        dismiss: () => Promise.resolve(true),
        onDidDismiss: () => Promise.resolve({} as OverlayEventDetail),
      } as HTMLIonModalElement)
    );
    vi.spyOn(accessibilityService, 'getTextZoomClass').mockReturnValue('regular');
  });

  describe('Class', () => {
    describe('openReverseDiagramModal', () => {
      it('should dispatch ReverseDiagramModal', async () => {
        await component.openReverseDiagramModal();
        expect(store$.dispatch).toHaveBeenCalledWith(ReverseDiagramOpened());
      });
      it('should create an instance of the modal with the correct properties', async () => {
        component.isPracticeMode = true;
        await component.openReverseDiagramModal();
        expect(modalController.create).toHaveBeenCalledWith({
          component: ReverseDiagramPage,
          componentProps: { onClose: expect.any(Function), isPracticeMode: true },
          cssClass: 'modal-fullscreen regular',
        });
      });
    });
    describe('closeReverseDiagramModal', () => {
      it('should dispatch ReverseDiagramClosed action', () => {
        component.closeReverseDiagramModal();
        expect(store$.dispatch).toHaveBeenCalledWith(ReverseDiagramClosed());
      });
    });
  });
});
