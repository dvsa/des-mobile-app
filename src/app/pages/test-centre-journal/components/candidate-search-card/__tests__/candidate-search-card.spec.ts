import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CandidateSearchCardComponent } from '../candidate-search-card';
import { ComponentsModule } from '../../../../../../components/common/common-components.module';
import { TestCentreDetailResponse } from '../../../../../shared/models/test-centre-journal.model';

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
      const mockData: TestCentreDetailResponse = {
        staffNumber: '',
        examiners: [
          {
            name: 'Examiner One',
            staffNumber: '012345',
            journal: {
              advanceTestSlots: [],
              deployments: [],
              examiner: {
                staffNumber: '',
                individualId: 10000009,
              },
              nonTestActivities: [],
              testSlots: [
                {
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
              ],
            },
          },
        ],
        testCentres: [],
      };
      component.testCentreResults = mockData;
      expect(component.getCandidateList()).toEqual([
        {
          name: 'Florence, Pearson',
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
});
