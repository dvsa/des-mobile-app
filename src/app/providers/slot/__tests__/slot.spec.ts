// TODO reintroduce in MES-6242
// import { TestBed } from '@angular/core/testing';
// import { cloneDeep } from 'lodash';

// import { SlotProvider } from '../slot';
// import { Store, StoreModule } from '@ngrx/store';
// import { StoreModel } from '../../../shared/models/store.model';
// import { TestSlotComponent } from '../../../components/test-slot/test-slot/test-slot';
// import { AppConfigProvider } from '../../app-config/app-config';
// import { AppConfigProviderMock } from '../../app-config/__mocks__/app-config.mock';
// import { DateTimeProvider } from '../../date-time/date-time';
// // import { SpecialNeedsCode } from '../../../shared/helpers/get-slot-type';
// import { TestSlot } from '@dvsa/mes-journal-schema';
// import { DateTime, Duration } from '../../../shared/helpers/date-time';
// import { DateTimeProviderMock } from '../../date-time/__mocks__/date-time.mock';
// import { configureTestSuite } from 'ng-bullet';

// const journalSlotsMissingDays = require('../__mocks__/journal-slots-missing-days-mock.json');

// describe('SlotProvider', () => {
//   let slotProvider;
//   let appConfigProvider;
//   let store$: Store<StoreModel>;

//   const startTime = '2019-02-01T11:22:33+00:00';
//   const mockSlot: TestSlot = {
//     slotDetail: {
//       slotId: 1001,
//       start: startTime,
//       duration: 57,
//     },
//     vehicleSlotTypeCode: 57,
//     testCentre: {
//       centreId: 54321,
//       centreName: 'Example Test Centre',
//       costCode: 'EXTC1',
//     },
//     booking: {
//       candidate: {
//         candidateId: 101,
//         candidateName: {
//           title: 'Miss',
//           firstName: 'Florence',
//           lastName: 'Pearson',
//         },
//         driverNumber: 'PEARS015220A99HC',
//         gender: 'F',
//         candidateAddress: {
//           addressLine1: '1 Station Street',
//           addressLine2: 'Someplace',
//           addressLine3: 'Sometown',
//           addressLine4: '',
//           addressLine5: '',
//           postcode: 'AB12 3CD',
//         },
//         primaryTelephone: '01234 567890',
//         secondaryTelephone: '04321 098765',
//         mobileTelephone: '07654 123456',
//       },
//       application: {
//         applicationId: 1234567,
//         bookingSequence: 3,
//         checkDigit: 1,
//         welshTest: false,
//         extendedTest: false,
//         meetingPlace: '',
//         progressiveAccess: false,
//         specialNeeds: 'Candidate has dyslexia',
//         specialNeedsCode: SpecialNeedsCode.NONE,
//         entitlementCheck: false,
//         vehicleSeats: 5,
//         vehicleHeight: 4,
//         vehicleWidth: 3,
//         vehicleLength: 2,
//         testCategory: 'B',
//         vehicleGearbox: 'Manual',
//       },
//       previousCancellation: [
//         'Act of nature',
//       ],
//     },
//   };

//   configureTestSuite(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         StoreModule.forRoot({}),
//       ],
//       providers: [
//         { provide: AppConfigProvider, useClass: AppConfigProviderMock },
//         { provide: DateTimeProvider, useClass: DateTimeProviderMock },
//         SlotProvider,
//       ],
//     });
//   });

//   beforeEach(() => {
//     store$ = TestBed.inject(Store);
//     slotProvider = TestBed.inject(SlotProvider);
//     appConfigProvider = TestBed.inject(AppConfigProvider);
//     spyOn(store$, 'dispatch');
//   });

//   describe('detectSlotChanges', () => {
//     const oldSlots = {
//       '2019-01-21': [
//         {
//           component: TestSlotComponent,
//           hasSlotChanged: false,
//           slotData: {
//             slotDetail: {
//               slotId: 1001,
//               start: '2018-12-10T08:10:00+00:00',
//               duration: 57,
//             },
//             vehicleSlotType: 'B57mins',
//             testCentre: {
//               centreId: 54321,
//               centreName: 'Example Test Centre',
//               costCode: 'EXTC1',
//             },
//             booking: {
//               candidate: {
//                 candidateId: 101,
//                 age: 17,
//                 candidateName: {
//                   title: 'Miss',
//                   firstName: 'Florence',
//                   lastName: 'Pearson',
//                 },
//                 driverNumber: 'PEARS015220A99HC',
//                 gender: 'Female',
//                 candidateAddress: {
//                   addressLine1: '1 Station Street',
//                   addressLine2: 'Someplace',
//                   addressLine3: 'Sometown',
//                   addressLine4: '',
//                   addressLine5: '',
//                   postcode: 'AB12 3CD',
//                 },
//                 primaryTelephone: '01234 567890',
//                 secondaryTelephone: '04321 098765',
//                 mobileTelephone: '07654 123456',
//               },
//               application: {
//                 applicationId: 1234567,
//                 bookingSequence: 3,
//                 checkDigit: 1,
//                 welshTest: false,
//                 extendedTest: false,
//                 meetingPlace: '',
//                 progressiveAccess: false,
//                 specialNeeds: 'Candidate has dyslexia',
//                 entitlementCheck: false,
//                 testCategory: 'B',
//                 vehicleGearbox: 'Manual',
//               },
//               previousCancellation: [
//                 'Act of nature',
//               ],
//             },
//           },
//         }, {
//           component: TestSlotComponent,
//           hasSlotChanged: false,
//           slotData: {
//             slotDetail: {
//               slotId: 1002,
//               start: '2018-12-10T10:14:00+00:00',
//               duration: 57,
//             },
//             vehicleSlotType: 'B57mins',
//             testCentre: {
//               centreId: 54321,
//               centreName: 'Example Test Centre',
//               costCode: 'EXTC1',
//             },
//             booking: {
//               candidate: {
//                 candidateId: 102,
//                 age: 22,
//                 candidateName: {
//                   title: 'Mr',
//                   firstName: 'Kamil',
//                   lastName: 'Zielinski',
//                 },
//                 driverNumber: 'ZIELI965220A99HC',
//                 gender: 'Male',
//                 candidateAddress: {
//                   addressLine1: '10 High Street',
//                   addressLine2: 'Someplace',
//                   addressLine3: 'Sometown',
//                   addressLine4: '',
//                   addressLine5: '',
//                   postcode: 'AB34 5CD',
//                 },
//                 primaryTelephone: '01234 567890',
//                 mobileTelephone: '07654 123456',
//               },
//               application: {
//                 applicationId: 1234568,
//                 bookingSequence: 1,
//                 checkDigit: 4,
//                 welshTest: false,
//                 extendedTest: false,
//                 meetingPlace: '',
//                 progressiveAccess: false,
//                 specialNeeds: '',
//                 entitlementCheck: false,
//                 testCategory: 'B',
//                 vehicleGearbox: 'Manual',
//               },
//             },
//           },
//         },
//       ],
//     };

//     const oldNonTestActivities = [
//       {
//         slotDetail: {
//           slotId: 1003,
//           start: '2018-12-10T09:07:00+01:00',
//           duration: 57,
//         },
//         activityCode: '091',
//         activityDescription: 'Travel period to detached TC and/or outstation',
//         testCentre: {
//           centreId: 54321,
//           centreName: 'Example Test Centre',
//           costCode: 'EXTC',
//         },
//       },
//     ];

//     const newJournal = {
//       staffNumber: 12345,
//       examinerName: {
//         title: 'Mr',
//         firstName: 'Joe',
//         secondName: 'Frederic',
//         thirdName: 'Englbert',
//         lastName: 'Bloggs',
//       },
//       permTestCentre: {
//         centreId: 54321,
//         centreName: 'Example Test Centre',
//         costCode: 'EXTC1',
//       },
//       testSlots: cloneDeep(oldSlots['2019-01-21'].map(slot => slot.slotData)),
//       nonTestActivities: cloneDeep(oldNonTestActivities),
//       personalCommitments: [],
//     };

//     describe('when there are no slots in the new journal', () => {
//       it('should return a blank array', () => {
//         const result = slotProvider.detectSlotChanges({}, {});
//         expect(result.length).toBe(0);
//       });
//     });

//     describe('when the new slots match the old slots exactly', () => {
//       it('should produce the new slot items indicating there was no change', () => {
//         const tempOldSlots = cloneDeep(oldSlots);
//         const tempNewJournal = cloneDeep(newJournal);
//         const result = slotProvider.detectSlotChanges(tempOldSlots, tempNewJournal);
//         expect(result.length).toBe(3);
//         expect(result[0].hasSlotChanged).toBe(false);
//         expect(result[1].hasSlotChanged).toBe(false);
//         expect(result[2].hasSlotChanged).toBe(false);
//       });
//     });

//     describe('when one of the new slots differ from the old slots', () => {
//       it('should produce the new slot items indicating there was a change', () => {
//         const tempOldSlots = cloneDeep(oldSlots);
//         const tempNewJournal = cloneDeep(newJournal);
//         tempNewJournal.testSlots[0].booking.candidate.driverNumber = 'NEWDRIVERNUMBER';
//         const result = slotProvider.detectSlotChanges(tempOldSlots, tempNewJournal);
//         expect(result.length).toBe(3);
//         expect(result[0].hasSlotChanged).toBe(true);
//         expect(result[1].hasSlotChanged).toBe(false);
//         expect(result[2].hasSlotChanged).toBe(false);
//       });
//     });

//     describe('when several of the slots differ from the old slots', () => {
//       it('should produce new slot items indicating which slots changed', () => {
//         const tempOldSlots = cloneDeep(oldSlots);
//         const tempNewJournal = cloneDeep(newJournal);
//         tempNewJournal.testSlots[0].booking.candidate.driverNumber = 'NEWDRIVERNUMBER';
//         tempNewJournal.testSlots[1].booking.application.welshTest = true;
//         const result = slotProvider.detectSlotChanges(tempOldSlots, tempNewJournal);
//         expect(result.length).toBe(3);
//         expect(result[0].hasSlotChanged).toBe(true);
//         expect(result[1].hasSlotChanged).toBe(false);
//         expect(result[2].hasSlotChanged).toBe(true);
//       });
//     });

//     describe('when the journal payload contains nonTestActivities', () => {
//       it('should mix them into the TestSlots such that they appear in date order', () => {
//         const result = slotProvider.detectSlotChanges(oldSlots, newJournal);
//         expect(result[1].slotData.activityCode).toBe('091');
//       });
//     });

//   });

//   describe('getSlotDate', () => {
//     it('should return the correct date YYYY-MM-DD', () => {
//       const slot = {
//         slotData: {
//           slotDetail: {
//             start: '2019-01-21T08:10:00+00:00',
//           },
//         },
//       };

//       const result = slotProvider.getSlotDate(slot);

//       expect(result).toBe('2019-01-21');
//     });
//   });

//   describe('extendWithEmptyDays', () => {
//     it('should have all days of the week', () => {
//       const slotsWithEmptyDays = slotProvider.extendWithEmptyDays(journalSlotsMissingDays);

//       const numberOfDays = Object.keys(slotsWithEmptyDays).length;

//       expect(numberOfDays).toBe(7);
//     });
//   });

//   describe('getRelevantSlots', () => {

//   });

//   describe('canStartTest', () => {
//     let getAppConfigSpy;
//     beforeEach(() => {
//       getAppConfigSpy = jasmine.createSpy('getAppConfig');
//       appConfigProvider.getAppConfig = getAppConfigSpy;
//     });
//     it('should disallow the test when there are no permissions', () => {
//       getAppConfigSpy.and.returnValue({ journal: { testPermissionPeriods: [] } });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(false);
//     });
//     it('should disallow the test when there are only permissions for other test categories', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'C', from: '2019-01-01', to: null },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(false);
//     });
//     it('should disallow the test when there are permissions for the category which have expired', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2019-01-01', to: '2019-01-20' },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(false);
//     });
//     it('should allow the test when there are multiple expired ranges and a subsequent valid range', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2018-01-01', to: '2018-03-01' },
//             { testCategory: 'B', from: '2018-05-01', to: '2018-07-01' },
//             { testCategory: 'B', from: '2019-01-01', to: '2019-02-01' },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(true);
//     });
//     it('should allow the test when there is a permission range including the slot date', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2019-01-01', to: '2019-02-02' },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(true);
//     });
//     it('should allow the test when there is a permission range starting on the slot date', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2019-02-01', to: '2019-02-20' },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(true);
//     });
//     it('should allow the test when there is a permission range ending on the slot date', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2019-01-20', to: '2019-02-01' },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(true);
//     });
//     it('should allow the test when there is a permission range for the slot date only', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2019-02-01', to: '2019-02-01' },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(true);
//     });
//     it('should allow the test when there is a non-date bounded permission range', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2019-02-01', to: null },
//           ],
//         },
//       });
//       expect(slotProvider.canStartTest(mockSlot)).toBe(true);
//     });
//     it('should disallow starting of tests that arent today', () => {
//       getAppConfigSpy.and.returnValue({
//         journal: {
//           testPermissionPeriods: [
//             { testCategory: 'B', from: '2019-01-01', to: null },
//           ],
//         },
//       });
//       const futureSlot = cloneDeep(mockSlot);
//       futureSlot.slotDetail.start =
//         DateTime.at(startTime).add(1, Duration.DAY).format('YYYY-MM-DDTHH:mm:ss+00:00');
//       expect(slotProvider.canStartTest(futureSlot)).toEqual(false);
//     });
//   });

//   describe('dateDiffInDays', () => {
//     it('should return 0 days as the date is the same as the periodDate', () => {
//       const date: Date = new Date('2019-01-10');
//       const periodDate: Date = new Date('2019-01-10');
//       expect(slotProvider.dateDiffInDays(date, periodDate)).toEqual(0);
//     });

//     it('should return 3 days difference between the date and the periodDate', () => {
//       const date: Date = new Date('2019-01-07');
//       const periodDate: Date = new Date('2019-01-10');
//       expect(slotProvider.dateDiffInDays(date, periodDate)).toEqual(3);
//     });
//   });

// });
