import * as moment from 'moment';
import { end2endPracticeSlotId } from '@shared/mocks/test-slot-ids.mock';

const todayAtHour = (hour: number) => moment().startOf('day').add(hour, 'hour');

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
      start: todayAtHour(6).add(10, 'minutes').format(),
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
      start: todayAtHour(6).add(55, 'minutes').format(),
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
        vehicleSeats: 3,
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
      start: todayAtHour(7).add(30, 'minutes').format(),
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
        vehicleSeats: 3,
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
      start: todayAtHour(8).add(10, 'minutes').format(),
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
        vehicleSeats: 4,
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
      start: todayAtHour(8).add(58, 'minutes').format(),
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
        vehicleSeats: 3,
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
      start: todayAtHour(9).add(45, 'minutes').format(),
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
        vehicleSeats: 4,
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
        emailAddress: 'josh@sykes.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_6`,
      start: todayAtHour(10).add(18, 'minutes').format(),
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
        vehicleSeats: 3,
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
        emailAddress: 'christopher@middleton.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_7`,
      start: todayAtHour(10).add(59, 'minutes').format(),
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
        vehicleSeats: 4,
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
        emailAddress: 'benjamin@palmer.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_8`,
      start: todayAtHour(11).add(25, 'minutes').format(),
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
        applicationId: 1903573,
        bookingSequence: 4,
        checkDigit: 4,
        entitlementCheck: false,
        categoryEntitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'DM',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 3,
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
          firstName: 'Erin',
          lastName: 'Osborne',
          title: 'Miss',
        },
        driverNumber: 'OSBOR925671F95DC',
        gender: 'F',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1974-01-03',
        ethnicityCode: 'A',
        emailAddress: 'erin@osborne.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_9`,
      start: todayAtHour(11).add(55, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1294321,
        bookingSequence: 1,
        checkDigit: 0,
        entitlementCheck: false,
        categoryEntitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'D1M',
        vehicleGearbox: 'Manual',
        vehicleHeight: 10,
        vehicleLength: 20,
        vehicleSeats: 4,
        vehicleWidth: 30,
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
        candidateId: 186,
        candidateName: {
          firstName: 'Teagan',
          lastName: 'Clarke',
          title: 'Mrs',
        },
        driverNumber: 'CLARK925671F95DC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2001-12-24',
        ethnicityCode: 'A',
        emailAddress: 'teagan@clarke.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_10`,
      start: todayAtHour(12).add(30, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
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
        testCategory: 'D+EM',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 3,
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
          firstName: 'James',
          lastName: 'Cole',
          title: 'Mr',
        },
        driverNumber: 'COLE9925671F95DC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2001-12-24',
        ethnicityCode: 'A',
        emailAddress: 'james@cole.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_11`,
      start: todayAtHour(13).add(5, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
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
        testCategory: 'D1+EM',
        vehicleGearbox: 'Manual',
        vehicleHeight: 9,
        vehicleLength: 18,
        vehicleSeats: 4,
        vehicleWidth: 5,
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
          firstName: 'Nathan',
          lastName: 'Jones',
          title: 'Mr',
        },
        driverNumber: 'JONES925671F95DC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '2001-12-24',
        ethnicityCode: 'A',
        emailAddress: 'nathan@jones.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_12`,
      start: todayAtHour(13).add(48, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1284470,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'D',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 3,
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
          firstName: 'James',
          lastName: 'Brown',
          title: 'Mr',
        },
        driverNumber: 'BROWN915220A99HC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1950-02-27',
        ethnicityCode: 'A',
        emailAddress: 'james@brown.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_13`,
      start: todayAtHour(14).add(40, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1284479,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'D1',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 4,
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
          firstName: 'Brandon',
          lastName: 'Carroll',
          title: 'Mr',
        },
        driverNumber: 'CARROL915220A99HC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1950-02-27',
        ethnicityCode: 'A',
        emailAddress: 'brandon@carroll.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_14`,
      start: todayAtHour(15).add(15, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1284478,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'D1+E',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 3,
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
          firstName: 'Aimee',
          lastName: 'King',
          title: 'Mrs',
        },
        driverNumber: 'KING9915220A99HC',
        gender: 'F',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1950-02-27',
        ethnicityCode: 'A',
        emailAddress: 'aimee@king.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_15`,
      start: todayAtHour(16).add(0, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 1284477,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'D+E',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 4,
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
          firstName: 'Poppy',
          lastName: 'Yates',
          title: 'Miss',
        },
        driverNumber: 'YATES9915220A99HC',
        gender: 'F',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1950-02-27',
        ethnicityCode: 'A',
        emailAddress: 'poppy@yates.com',
      },
      business: {
        businessAddress: {
          addressLine1: '1 Business Street',
          addressLine2: 'Businessplace',
          addressLine3: 'Businesstown',
          postcode: 'BUSI N ESS',
        },
        businessName: 'Business Name',
        telephone: '0234 234433',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_16`,
      start: todayAtHour(16).add(42, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 2299201,
        bookingSequence: 7,
        checkDigit: 7,
        entitlementCheck: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'CCPC',
        vehicleGearbox: 'Manual',
        welshTest: false,
      },
      candidate: {
        candidateAddress: {
          addressLine1: '1 Hangar Lane',
          addressLine2: 'Someplace',
          addressLine3: 'Sometown',
          postcode: 'AB78 9CD',
        },
        candidateId: 117,
        candidateName: {
          firstName: 'Holly',
          lastName: 'Walters',
          title: 'Miss',
        },
        driverNumber: 'WALTER375220A99HC',
        gender: 'F',
        primaryTelephone: '01234 567890',
        dateOfBirth: '1970-09-06',
        ethnicityCode: 'A',
        emailAddress: 'holly@walters.com',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_17`,
      start: todayAtHour(17).add(15, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'F',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
  {
    booking: {
      application: {
        applicationId: 9866476,
        bookingSequence: 1,
        checkDigit: 3,
        entitlementCheck: false,
        specialNeedsCode: 'NONE',
        specialNeedsExtendedTest: false,
        extendedTest: false,
        progressiveAccess: false,
        testCategory: 'DCPC',
        vehicleGearbox: 'Manual',
        vehicleHeight: 5,
        vehicleLength: 15,
        vehicleSeats: 3,
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
          firstName: 'Andy',
          lastName: 'Thomas',
          title: 'Mr',
        },
        driverNumber: 'THOMA915220A99HC',
        gender: 'M',
        mobileTelephone: '07654 123456',
        primaryTelephone: '01234 567890',
        secondaryTelephone: '04321 098765',
        dateOfBirth: '1950-02-27',
        ethnicityCode: 'A',
        emailAddress: 'andy@thomas.com',
      },
      business: {
        businessAddress: {
          addressLine1: '1 Business Street',
          addressLine2: 'Businessplace',
          addressLine3: 'Businesstown',
          postcode: 'BUSI N ESS',
        },
        businessName: 'Business Name',
        telephone: '0234 234433',
      },
    },
    slotDetail: {
      duration: 57,
      slotId: `${end2endPracticeSlotId}_18`,
      start: todayAtHour(17).add(50, 'minutes').format(),
    },
    testCentre: {
      centreId: 54321,
      centreName: 'Example Test Centre',
      costCode: 'EXTC1',
    },
    vehicleTypeCode: 'D',
    vehicleSlotTypeCode: 7,
    examinerVisiting: false,
  },
];
