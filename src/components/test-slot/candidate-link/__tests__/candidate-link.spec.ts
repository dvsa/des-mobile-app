import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CommonModule } from '@angular/common';
import { Style } from '@capacitor/status-bar';
import { CandidateLinkComponent } from '@components/test-slot/candidate-link/candidate-link';
import { ModalController } from '@ionic/angular';
import { ModalControllerMock } from '@mocks/index.mock';
import { StoreModule } from '@ngrx/store';

describe('CandidateLinkComponent', () => {
  let fixture: ComponentFixture<CandidateLinkComponent>;
  let component: CandidateLinkComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, StoreModule.forRoot({}), CandidateLinkComponent],
      providers: [{ provide: ModalController, useClass: ModalControllerMock }],
    });

    fixture = TestBed.createComponent(CandidateLinkComponent);
    component = fixture.componentInstance;
    component.slot = {
      slotDetail: {},
      vehicleTypeCode: 'A3',
      vehicleSlotTypeCode: 0,
      testCentre: {},
      booking: {
        candidate: {
          candidateId: 12345,
          candidateName: {
            title: 'Mr',
            firstName: 'Test',
            lastName: 'Candidate',
          },
          candidateAddress: {
            addressLine1: '123 Test Street',
            addressLine2: 'Test Town',
            addressLine3: 'Test County',
            postcode: 'TE1 2ST',
          },
          primaryTelephone: '01234567890',
        },
        application: {
          applicationId: 1,
          bookingSequence: 1,
          checkDigit: 1,
          specialNeeds: 'test',
        },
      },
      examinerVisiting: false,
    };
  });

  describe('openCandidateDetailsModal', () => {
    it('should configure status bar to dark style', async () => {
      vi.spyOn(component.accessibilityService, 'configureStatusBar').mockResolvedValue(undefined);
      vi.spyOn(component.modalController, 'getTop').mockResolvedValue({} as HTMLIonModalElement);
      await component.openCandidateDetailsModal();
      expect(component.accessibilityService.configureStatusBar).toHaveBeenCalledWith(Style.Dark);
    });

    it('should not create a new modal if one is already present', async () => {
      vi.spyOn(component.modalController, 'getTop').mockResolvedValue({
        present: async () => {},
      } as HTMLIonModalElement);
      vi.spyOn(component.modalController, 'create');
      await component.openCandidateDetailsModal();
      expect(component.modalController.create).not.toHaveBeenCalled();
    });

    it('should create and present a new modal if none is present', async () => {
      vi.spyOn(component.modalController, 'getTop').mockReturnValue(Promise.resolve(null));
      vi.spyOn(component.modalController, 'create').mockResolvedValue({
        present: async () => {},
      } as HTMLIonModalElement);
      await component.openCandidateDetailsModal();
      expect(component.modalController.create).toHaveBeenCalled();
    });

    it('should pass correct component props to the modal', async () => {
      vi.spyOn(component.modalController, 'getTop').mockResolvedValue(null);
      vi.spyOn(component.modalController, 'create').mockImplementation(async (options) => {
        expect(options.componentProps).toEqual({
          isPracticeMode: component.isPracticeMode,
          slots: component.slots,
          slot: component.slot,
          slotChanged: component.slotChanged,
          isTeamJournal: component.isTeamJournal,
        });
        return {
          present: async () => {},
        } as HTMLIonModalElement;
      });
      await component.openCandidateDetailsModal();
    });

    it('should apply the correct zoom class to the modal', async () => {
      vi.spyOn(component.modalController, 'getTop').mockResolvedValue(null);
      vi.spyOn(component.accessibilityService, 'getTextZoomClass').mockReturnValue('zoom-class');
      vi.spyOn(component.modalController, 'create').mockImplementation(async (options) => {
        expect(options.cssClass).toContain('modal-fullscreen zoom-class');
        return {
          present: async () => {},
        } as HTMLIonModalElement;
      });
      await component.openCandidateDetailsModal();
    });
  });

  describe('parseName', () => {
    it('returns "Name unknown" when name is not provided', () => {
      expect(component.parseName(null)).toBe('Name unknown');
    });

    it('returns full name with title when title provided', () => {
      const name = { title: 'Mr', firstName: 'John', lastName: 'Doe' };
      expect(component.parseName(name)).toBe('Mr John Doe');
    });

    it('returns first and last name when title not provided', () => {
      const name = { firstName: 'Jane', lastName: 'Smith' };
      expect(component.parseName(name)).toBe('Jane Smith');
    });
  });
});
