import { configureTestSuite } from 'ng-bullet';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TestCentreDetailResponse } from '@shared/models/test-centre-journal.model';
import { ComponentsModule } from '@components/common/common-components.module';

import { CandidateData, CandidateSearchCardComponent } from '../candidate-search-card';
import * as mockData from '../__mocks__/candidate-search-card.mock';
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

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(CandidateSearchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCandidateList', () => {
    it('should return the correct data', () => {
      const expectedCandidateList = [
        {
          name: 'Florence Pearson',
        },
      ] as CandidateData[];
      component.testCentreResults = mockData.mockExaminerData;
      const candidateList = component.getCandidateList();
      expect(candidateList).toEqual(expectedCandidateList);
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

  describe('get slashSeperatedTestCentres', () => {
    it('should replace the commas in the string with slashes', () => {
      component.testCentreName = 'TEST CENTRE A, TEST CENTRE B, TEST CENTRE C';
      expect(component.slashSeperatedTestCentres).toEqual('TEST CENTRE A / TEST CENTRE B / TEST CENTRE C');
    });
    it('should use default if not defined', () => {
      component.testCentreName = null;
      expect(component.slashSeperatedTestCentres).toEqual('test centre');
    });
  });

});
