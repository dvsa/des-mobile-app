import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CandidateData, CandidateSearchCardComponent } from '../candidate-search-card';
import { ComponentsModule } from '../../../../../../components/common/common-components.module';
import * as mockData from './mock-data/mock-data';
import { TestCentreDetailResponse } from '../../../../../shared/models/test-centre-journal.model';
import { TestCentreJournalComponentsModule } from '../../test-centre-journal-components.module';

describe('CandidateSearchCardComponent', () => {
  let component: CandidateSearchCardComponent;
  let fixture: ComponentFixture<CandidateSearchCardComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateSearchCardComponent],
      imports: [
        IonicModule,
        CommonModule,
        ComponentsModule,
        TestCentreJournalComponentsModule,
      ],
    });
  });

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CandidateSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCandidateList', () => {
    it('should return the correct data', () => {
      component.testCentreResults = mockData.mockExaminerData;
      expect(component.getCandidateList()).toEqual([
        {
          name: 'Florence Pearson',
          slot: {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
              },
              candidate: {
                candidateName: {
                  firstName: 'Florence',
                  lastName: 'Pearson',
                  title: 'Miss',
                },
              },
            },
            examinerVisiting: false,
            slotDetail: {},
            testCentre: {},
            vehicleSlotTypeCode: 7,
            vehicleTypeCode: 'C',
          },
        },
      ]);
    });
  });

  describe('createCandidateSlots', () => {
    it('should create an array of all the test slots for the selected candidate name', () => {
      component.createCandidateSlots(mockData.mockMultipleExaminerTestSlots, 'Joe Bloggs');
      expect(component.candidateTestSlots.length).toEqual(2);
    });
  });

  describe('onCandidateDidChange', () => {
    it('should enable the show results button if valid candidate selected', () => {
      spyOn(component, 'createCandidateSlots');
      const candidateName: string = 'Joe Bloggs';
      component.testCentreResults = {
        examiners: [],
      } as TestCentreDetailResponse;
      const candidate = {
        name: candidateName,
      } as CandidateData;
      component.onCandidateDidChange(candidate);
      expect(component.shouldShowCandidateResults).toEqual(false);
      expect(component.selectedCandidateName).toEqual(candidateName);
      expect(component.createCandidateSlots).toHaveBeenCalledWith([], candidateName);
      expect(component.enableShowBookingButton).toEqual(true);
    });
    it('should disable the show results button if invalid candidate entered', () => {
      component.onCandidateDidChange(null);
      expect(component.enableShowBookingButton).toEqual(false);
    });
  });

  describe('showResults', () => {
    it('should set the local property', () => {
      component.showResults();
      expect(component.shouldShowCandidateResults).toEqual(true);
    });
  });

});
