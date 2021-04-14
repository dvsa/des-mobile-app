import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';

export const getInstructorRegistrationNumber = (
  instructorDetails: CatBUniqueTypes.InstructorDetails,
) => instructorDetails.registrationNumber;
