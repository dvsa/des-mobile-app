import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { IonicModule } from '@ionic/angular';
import { ExaminerStatsPage } from '../examiner-stats.page';
import { ExaminerStatsViewDidEnter } from '@pages/examiner-stats/examiner-stats.actions';

describe('ExaminerStatsPage', () => {
  let component: ExaminerStatsPage;
  let fixture: ComponentFixture<ExaminerStatsPage>;
  let store$: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ExaminerStatsPage],
      imports: [IonicModule],
      providers: [
        { provide: Store, useClass: MockStore },
        provideMockStore({
          initialState: {
            tests: {
              startedTests: {
                1: {
                  'appVersion': '4.10.0.0',
                  'version': '3.42.5',
                  'category': 'B',
                  'activityCode': '11',
                  'journalData': {
                    'examiner': { 'staffNumber': '1234567', 'individualId': 9000001 },
                    'testCentre': { 'centreId': 54322, 'costCode': 'EXTC1', 'centreName': 'Example Test Centre' },
                    'testSlotAttributes': {
                      'welshTest': false,
                      'slotId': 5137,
                      'start': new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toString(),
                      'specialNeeds': false,
                      'specialNeedsCode': 'EXTRA',
                      'specialNeedsArray': ['None'],
                      'vehicleTypeCode': 'C',
                      'extendedTest': false,
                      'examinerVisiting': false,
                      'previousCancellation': ['Act of nature'],
                      'entitlementCheck': false,
                      'categoryEntitlementCheck': false,
                      'fitMarker': false,
                      'slotType': 'Extra Time Needed',
                    },
                    'candidate': {
                      'candidateAddress': {
                        'addressLine1': '2345 Station Street',
                        'addressLine2': 'Someplace',
                        'addressLine3': 'Sometown',
                        'postcode': 'AB12 3CD',
                      },
                      'candidateId': 126,
                      'candidateName': { 'firstName': 'test', 'lastName': 'data', 'title': 'Mr' },
                      'driverNumber': 'COOPE015220A99HC',
                      'mobileTelephone': '07654 123456',
                      'primaryTelephone': '01234 567890',
                      'secondaryTelephone': '04321 098765',
                      'dateOfBirth': '1974-09-14',
                      'ethnicityCode': 'E',
                      'gender': 'F',
                    },
                    'applicationReference': { 'applicationId': 20654332, 'bookingSequence': 3, 'checkDigit': 1 },
                  },
                  'preTestDeclarations': {
                    'insuranceDeclarationAccepted': true,
                    'residencyDeclarationAccepted': true,
                    'preTestSignature': '',
                    'candidateDeclarationSigned': false,
                  },
                  'accompaniment': {},
                  'vehicleDetails': {
                    'registrationNumber': '1',
                    'gearboxCategory': 'Manual',
                    'motStatus': 'No details found',
                  },
                  'instructorDetails': {},
                  'testData': {
                    'drivingFaults': { 'moveOffSafety': 1, 'moveOffControl': 1 },
                    'dangerousFaults': {},
                    'seriousFaults': {},
                    'vehicleChecks': {
                      'tellMeQuestion': { 'code': 'T6', 'description': 'Antilock braking system', 'outcome': 'P' },
                      'showMeQuestion': { 'outcome': 'P', 'code': 'S1', 'description': 'Rear windscreen' },
                    },
                    'controlledStop': { 'selected': false },
                    'eco': { 'completed': true, 'adviceGivenControl': true, 'adviceGivenPlanning': true },
                    'ETA': {},
                    'eyesightTest': { 'complete': true, 'seriousFault': false },
                    'manoeuvres': { 'reverseRight': { 'selected': true } },
                    'testRequirements': {
                      'normalStart1': true,
                      'normalStart2': true,
                      'hillStart': true,
                      'angledStart': true,
                    },
                  },
                  'passCompletion': { 'passCertificateNumber': 'A123456X', 'provisionalLicenceProvided': true },
                  'postTestDeclarations': {
                    'healthDeclarationAccepted': true,
                    'passCertificateNumberReceived': true,

                    'postTestSignature': '',
                  },
                  'testSummary': {
                    'routeNumber': 1,
                    'independentDriving': 'Traffic signs',
                    'candidateDescription': '1',
                    'additionalInformation': null,
                    'weatherConditions': ['Snowing'],
                    'debriefWitnessed': true,
                    'D255': false,
                    'identification': 'Licence',
                    'trueLikenessToPhoto': true,
                  },
                  'communicationPreferences': {
                    'updatedEmail': '',
                    'communicationMethod': 'Post',
                    'conductedLanguage': 'English',
                  },
                  'rekey': false,
                  'rekeyDate': null,
                  'rekeyReason': {
                    'ipadIssue': {
                      'selected': false,
                      'broken': false,
                      'lost': false,
                      'technicalFault': false,
                      'stolen': false,
                    }, 'other': { 'selected': false, 'reason': '' }, 'transfer': { 'selected': false },
                  },
                  'delegatedTest': false,
                  'examinerBooked': 1234567,
                  'examinerConducted': 1234567,
                  'examinerKeyed': 1234567,
                  'changeMarker': false,
                },
              },
            },
          },
        }),
      ],
    });
    fixture = TestBed.createComponent(ExaminerStatsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store$ = TestBed.inject(MockStore);
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
    expect(store$).toBeTruthy();
  });

  describe('ionViewDidEnter', () => {
    it('should dispatch the store with ExaminerStatsViewDidEnter', () => {
      spyOn(component.store$, 'dispatch');

      component.ionViewDidEnter();
      expect(component.store$.dispatch).toHaveBeenCalledWith(ExaminerStatsViewDidEnter());
    });
  });
});
