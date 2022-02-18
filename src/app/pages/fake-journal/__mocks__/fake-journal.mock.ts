import * as moment from 'moment';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';

const todayAt8Am = moment().startOf('day').add(8, 'hour');

export const fakeJournalTestSlots = [
  {
    booking: {
      application: {
        applicationId: 1234532,
        bookingSequence: 7,
        checkDigit: 7,
        entitlementCheck: false,
        categoryEntitlementCheck: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'B',
        vehicleGearbox: 'Manual',
        welshTest: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        meetingPlace: 'Next to test centre',
      },
      candidate: {
        candidateAddress: {
          addressLine1: '1 Hangar Lane',
          addressLine2: 'Someplace',
          addressLine3: 'Sometown',
          postcode: 'AB78 9CD',
        },
        candidateId: 107,
        candidateName: {
          firstName: 'Jeremy',
          lastName: 'Craig',
          title: 'Captain',
        },
        driverNumber: 'CRAIG375220A99HC',
        primaryTelephone: '01234 567890',
        emailAddress: 'captain@jeremy.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_0`,
      start: todayAt8Am.add(58, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleSlotType: 'B57mins',
    vehicleSlotTypeCode: 7,
  },
  {
    booking: {
      application: {
        applicationId: 1234572,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: true,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'C',
        vehicleGearbox: 'Manual',
        vehicleHeight: 15,
        vehicleLength: 30,
        vehicleSeats: 4,
        vehicleWidth: 15,
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'The Gables Cottage',
          addressLine2: 'Home Farm',
          addressLine3: 'Farm Road',
          addressLine4: 'Farm Area',
          addressLine5: 'Farmtown',
          postcode: 'FA43 9XY',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Liam',
          lastName: 'Black',
          title: 'Mr',
        },
        driverNumber: 'BLACK922300A945HA',
        gender: 'M',
        mobileTelephone: '07123 453828',
        primaryTelephone: '01234 412890',
        secondaryTelephone: '04321 145765',
        dateOfBirth: '1980-10-15',
        ethnicityCode: 'A',
        emailAddress: 'liam@black.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_1`,
      start: todayAt8Am.add(1, 'hours').add(12, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1234472,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'C1',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 50,
        vehicleWidth: 2,
        welshTest: true,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'The Gables Cottage',
          addressLine2: 'Home Farm',
          addressLine3: 'Farm Road',
          addressLine4: 'Farm Area',
          addressLine5: 'Farmtown',
          postcode: 'FA43 9XY',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Danielle',
          lastName: 'Butler',
          title: 'Miss',
        },
        driverNumber: 'BUTLE934507A14AW',
        gender: 'F',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1985-10-01',
        ethnicityCode: 'A',
        emailAddress: 'danielle@butler.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_2`,
      start: todayAt8Am.add(2, 'hours').add(30, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1284472,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: true,
        categoryEntitlementCheck: true,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'C+E',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 50,
        vehicleWidth: 2,
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'The Gables Cottage',
          addressLine2: 'Home Farm',
          addressLine3: 'Farm Road',
          addressLine4: 'Farm Area',
          addressLine5: 'Farmtown',
          postcode: 'FA43 9XY',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Elizabeth',
          lastName: 'Smith',
          title: 'Mrs',
        },
        driverNumber: 'SMITH937920A49PO',
        gender: 'F',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2000-01-15',
        ethnicityCode: 'A',
        emailAddress: 'elizabeth@smith.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_3`,
      start: todayAt8Am.add(3, 'hours').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1237472,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        categoryEntitlementCheck: true,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'C1+E',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 50,
        vehicleWidth: 2,
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'The Gables Cottage',
          addressLine2: 'Home Farm',
          addressLine3: 'Farm Road',
          addressLine4: 'Farm Area',
          addressLine5: 'Farmtown',
          postcode: 'FA43 9XY',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Robert',
          lastName: 'Wilkinson',
          title: 'Mr',
        },
        driverNumber: 'WILKI925671F95DC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2001-12-24',
        ethnicityCode: 'A',
        emailAddress: 'robert@wilkinson.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_4`,
      start: todayAt8Am.add(1, 'hours').add(21, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1263673,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        categoryEntitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'CM',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 50,
        vehicleWidth: 2,
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: '46',
          addressLine2: 'Newgate Street',
          addressLine3: 'Iwerne',
          addressLine4: 'Minster',
          addressLine5: '',
          postcode: 'DT11 8WF',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Madison',
          lastName: 'Herberts',
          title: 'Ms',
        },
        driverNumber: 'HERBE925671F95DC',
        gender: 'F',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1974-01-03',
        ethnicityCode: 'A',
        emailAddress: 'madison@herberts.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_5`,
      start: todayAt8Am.add(2, 'hours').add(31, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1294875,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        categoryEntitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'C1M',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 50,
        vehicleWidth: 2,
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'The Gables Cottage',
          addressLine2: 'Home Farm',
          addressLine3: 'Farm Road',
          addressLine4: 'Farm Area',
          addressLine5: 'Farmtown',
          postcode: 'FA43 9XY',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Josh',
          lastName: 'Sykes',
          title: 'Mr',
        },
        driverNumber: 'SYKES925671F95DC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2001-12-24',
        ethnicityCode: 'A',
        emailAddress: 'robert@wilkinson.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_6`,
      start: todayAt8Am.add(3, 'hours').add(16, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1543264,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        categoryEntitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'C+EM',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 50,
        vehicleWidth: 2,
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'The Gables Cottage',
          addressLine2: 'Home Farm',
          addressLine3: 'Farm Road',
          addressLine4: 'Farm Area',
          addressLine5: 'Farmtown',
          postcode: 'FA43 9XY',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Christopher',
          lastName: 'Middleton',
          title: 'Mr',
        },
        driverNumber: 'MIDDL925671F95DC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2001-12-24',
        ethnicityCode: 'A',
        emailAddress: 'robert@wilkinson.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_7`,
      start: todayAt8Am.add(1, 'hours').add(50, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1638904,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        categoryEntitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'C1+EM',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 50,
        vehicleWidth: 2,
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: 'The Gables Cottage',
          addressLine2: 'Home Farm',
          addressLine3: 'Farm Road',
          addressLine4: 'Farm Area',
          addressLine5: 'Farmtown',
          postcode: 'FA43 9XY',
        },
        candidateId: 106,
        candidateName: {
          firstName: 'Benjamin',
          lastName: 'Palmer',
          title: 'Mr',
        },
        driverNumber: 'PALME925671F95DC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2001-12-24',
        ethnicityCode: 'A',
        emailAddress: 'robert@wilkinson.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_8`,
      start: todayAt8Am.add(3, 'hours').add(29, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'C',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
];
