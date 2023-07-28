import { getSlotType, SpecialNeedsCode } from '@shared/helpers/get-slot-type';
import { SlotTypes } from '@shared/models/slot-types';
import { TestSlot } from '@dvsa/mes-journal-schema';
import {
  getBusiness,
  getCandidateId,
  getFitMarker,
  getPhoneNumber,
  getSlotChanged,
  getTime,
  isCandidateCheckNeeded,
  isCandidateCommentsEmpty,
  isCandidateSpecialNeeds,
  processSpecialNeeds,
} from '../candidate-details.selector';

describe('Candidate Details Selector', () => {
  describe('processSpecialNeeds', () => {
    it('returns single item array for string.', () => {
      const slot = {
        booking: {
          application: {
            specialNeeds: 'there are some special needs',
          },
        },
      } as TestSlot;

      const result = processSpecialNeeds(slot);

      expect(result)
        .toEqual(['there are some special needs']);
      expect(result.length)
        .toBe(1);
    });
    it('returns multiple element array for semicolon seperated string', () => {
      const slot = {
        booking: {
          application: {
            specialNeeds: 'one;two;three',
          },
        },
      } as TestSlot;

      const result = processSpecialNeeds(slot);

      expect(result)
        .toEqual(['one', 'two', 'three']);
      expect(result.length)
        .toBe(3);
    });
    it('returns string of `Null` when no value set for `specialNeeds`', () => {
      const slot = {
        booking: {
          application: {},
        },
      } as TestSlot;

      const result = processSpecialNeeds(slot);
      expect(result)
        .toEqual('None');
    });
    it('return `Nonr` when special needs is a false-y value', () => {
      const slot = {
        booking: {
          application: {
            specialNeeds: null,
          },
        },
      } as TestSlot;

      const result = processSpecialNeeds(slot);
      expect(result)
        .toEqual('None');
    });
  });

  describe('getTime', () => {
    it('returns the start time of the slot', () => {
      const slotStartTime = 'some date';
      const slot = {
        slotDetail: {
          start: slotStartTime,
        },
      };

      const result = getTime(slot);

      expect(result)
        .toEqual(slotStartTime);
    });
  });

  describe('isCandidateCommentsEmpty', () => {
    it('returns true if the specialNeeds and previousCancellation are empty', () => {
      const slot = {
        booking: {
          previousCancellation: [],
        },
      } as TestSlot;

      const result = isCandidateCommentsEmpty(slot);

      expect(result)
        .toBe(true);
    });

    it('returns false if the previousCancellation is not empty', () => {
      const slot = {
        booking: {
          previousCancellation: ['Act of nature'],
        },
      } as TestSlot;

      const result = isCandidateCommentsEmpty(slot);

      expect(result)
        .toBe(false);
    });
  });

  describe('getCandidateId', () => {
    it('returns a candidate id', () => {
      const candidateId = '12354567';
      const slot = {
        booking: {
          candidate: {
            candidateId,
          },
        },
      };
      const result = getCandidateId(slot);
      expect(result)
        .toEqual('12354567');
    });
  });

  describe('isCandidateSpecialNeeds', () => {
    it('returns true if special needs exist', () => {
      const slot = {
        booking: {
          application: {
            specialNeeds: 'there are some special needs',
          },
          previousCancellation: [],
        },
      } as TestSlot;
      const result = isCandidateSpecialNeeds(slot);
      expect(result)
        .toEqual(true);
    });
  });

  describe('getSlotType', () => {
    describe('vehicleSlotTypeCode is 6 and specialNeedsCode not NONE', () => {
      it('should return Single Slot (Special Needs)', () => {
        const slot = {
          vehicleSlotTypeCode: 6,
          booking: {
            application: {
              applicationId: 1234567,
              bookingSequence: 3,
              checkDigit: 1,
              specialNeedsCode: SpecialNeedsCode.YES,
            },
          },
        };
        const result = getSlotType(slot);
        expect(result)
          .toBe(SlotTypes.SINGLE_SLOT_SPECIAL_NEEDS);
      });
    });

    describe('vehicleSlotTypeCode is 14 and specialNeedsCode not NONE', () => {
      it('should return Single Slot (Special Needs)', () => {
        const slot = {
          vehicleSlotTypeCode: 14,
          booking: {
            application: {
              applicationId: 1234567,
              bookingSequence: 3,
              checkDigit: 1,
              specialNeedsCode: SpecialNeedsCode.YES,
            },
          },
        };
        const result = getSlotType(slot);
        expect(result)
          .toBe(SlotTypes.SINGLE_SLOT_SPECIAL_NEEDS);
      });
    });

    describe('specialNeedsExtendedTest is true', () => {
      const specialNeedsExtendedTestValue = true;

      describe('specialNeedsCode is NONE', () => {
        const specialNeedsCodeValue = SpecialNeedsCode.NONE;

        it('should return Extended Test', () => {
          const slot = {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
                specialNeedsExtendedTest: specialNeedsExtendedTestValue,
                specialNeedsCode: specialNeedsCodeValue,
              },
            },
          };
          const result = getSlotType(slot);
          expect(result)
            .toBe(SlotTypes.EXTENDED_TEST);
        });
      });

      describe('specialNeedsCode is YES', () => {
        const specialNeedsCodeValue = SpecialNeedsCode.YES;

        it('should return Extended Test Special Needs', () => {
          const slot = {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
                specialNeedsExtendedTest: specialNeedsExtendedTestValue,
                specialNeedsCode: specialNeedsCodeValue,
              },
            },
          };
          const result = getSlotType(slot);
          expect(result)
            .toBe(SlotTypes.EXTENDED_TEST_SPECIAL_NEEDS);
        });
      });

      describe('specialNeedsCode is EXTRA', () => {
        const specialNeedsCodeValue = SpecialNeedsCode.EXTRA;

        it('should return Extended Test Special Needs', () => {
          const slot = {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
                specialNeedsExtendedTest: specialNeedsExtendedTestValue,
                specialNeedsCode: specialNeedsCodeValue,
              },
            },
          };
          const result = getSlotType(slot);
          expect(result)
            .toBe(SlotTypes.EXTENDED_TEST_SPECIAL_NEEDS);
        });
      });
    });

    describe('specialNeedsExtendedTest is false', () => {
      const specialNeedsExtendedTestValue = false;

      describe('specialNeedsCode is NONE', () => {
        const specialNeedsCodeValue = SpecialNeedsCode.NONE;

        it('should return Standard Test', () => {
          const slot = {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
                specialNeedsExtendedTest: specialNeedsExtendedTestValue,
                specialNeedsCode: specialNeedsCodeValue,
              },
            },
          };
          const result = getSlotType(slot);
          expect(result)
            .toBe(SlotTypes.STANDARD_TEST);
        });
      });

      describe('specialNeedsCode is YES', () => {
        const specialNeedsCodeValue = SpecialNeedsCode.YES;

        it('should return Standard Test', () => {
          const slot = {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
                specialNeedsExtendedTest: specialNeedsExtendedTestValue,
                specialNeedsCode: specialNeedsCodeValue,
              },
            },
          };
          const result = getSlotType(slot);
          expect(result)
            .toBe(SlotTypes.STANDARD_TEST);
        });
      });

      describe('specialNeedsCode is EXTRA', () => {
        const specialNeedsCodeValue = SpecialNeedsCode.EXTRA;

        it('should return Special Needs Extra Time', () => {
          const slot = {
            booking: {
              application: {
                applicationId: 1234567,
                bookingSequence: 3,
                checkDigit: 1,
                specialNeedsExtendedTest: specialNeedsExtendedTestValue,
                specialNeedsCode: specialNeedsCodeValue,
              },
            },
          };
          const result = getSlotType(slot);
          expect(result)
            .toBe(SlotTypes.SPECIAL_NEEDS_EXTRA_TIME);
        });
      });
    });
  });

  describe('isCandidateCheckNeeded', () => {
    it('returns true if entitlement check needed', () => {
      const slot = {
        booking: {
          application: {
            entitlementCheck: true,
          },
          previousCancellation: [],
        },
      } as TestSlot;
      const result = isCandidateCheckNeeded(slot);
      expect(result)
        .toEqual(true);
    });
  });

  describe('getSlotChanged', () => {
    it('returns true if slot marked as changed', () => {
      const slot = {
        hasSlotChanged: true,
        booking: {
          application: {
            entitlementCheck: true,
          },
          previousCancellation: [],
        },
      };
      const result = getSlotChanged(slot);
      expect(result)
        .toEqual(true);
    });
  });

  describe('getFitMarker', () => {
    it('returns true if fit marker is true', () => {
      const slot = {
        booking: {
          application: {
            fitMarker: true,
          },
          previousCancellation: [],
        },
      } as TestSlot;
      const result = getFitMarker(slot);
      expect(result)
        .toEqual(true);
    });
  });

  describe('getPhoneNumber', () => {
    const mobileTelephone = '12453643622';
    const primaryTelephone = '1254326236236';
    const secondaryTelephone = '32543622255452';
    it('returns mobileTelephone if it is provided', () => {
      const candidate = {
        mobileTelephone,
        primaryTelephone,
        secondaryTelephone,
      };

      const result = getPhoneNumber(candidate);

      expect(result)
        .toEqual(mobileTelephone);
    });

    it('returns primaryTelephone if it is provided and mobileTelephone is not provided', () => {
      const candidate = {
        primaryTelephone,
        secondaryTelephone,
      };

      const result = getPhoneNumber(candidate);

      expect(result)
        .toEqual(primaryTelephone);
    });

    it('returns secondaryTelephone if it is probided and mobileTelephone is not provided nor primaryTelephone', () => {
      const candidate = {
        secondaryTelephone,
      };

      const result = getPhoneNumber(candidate);

      expect(result)
        .toEqual(secondaryTelephone);
    });

    it('returns No phone number provided if none of the phone numbers are provided', () => {
      const candidate = {};

      const result = getPhoneNumber(candidate);

      expect(result)
        .toEqual('No phone number provided');
    });
  });

  describe('getBusiness', () => {
    it('should return the business', () => {
      const mockBusiness = {
        businessId: 1234,
        businessName: 'My Business',
      };

      const slot = {
        hasSlotChanged: true,
        booking: {
          application: {
            entitlementCheck: true,
          },
          previousCancellation: [],
          business: mockBusiness,
        },
      };

      expect(getBusiness(slot))
        .toEqual(mockBusiness);
    });
  });
});
