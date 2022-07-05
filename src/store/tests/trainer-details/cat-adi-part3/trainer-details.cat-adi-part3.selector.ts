import { TrainerDetails } from '@dvsa/mes-test-schema/categories/ADI3';

export const getPDILogbook = (trainerDetails: TrainerDetails) => trainerDetails.pdiLogbook;
export const getTraineeLicence = (trainerDetails: TrainerDetails) => trainerDetails.traineeLicence;
