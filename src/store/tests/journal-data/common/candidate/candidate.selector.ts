import { Candidate } from '@dvsa/mes-test-schema/categories/common';
import { createSelector } from '@ngrx/store';
import { selectCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';

export const selectCandidateName = createSelector(
  selectCandidate,
  ({ candidateName }) => {
    if (!candidateName) return '';
    const {
      title,
      firstName,
      lastName,
    } = candidateName;
    return title ? `${title} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
  },
);

export const selectUntitledCandidateName = createSelector(
  selectCandidate,
  ({ candidateName }) => {
    if (!candidateName) return '';
    const {
      firstName,
      lastName,
    } = candidateName;
    return `${firstName} ${lastName}`;
  },
);

export const getCandidateName = (candidate: Candidate): string => {
  if (!candidate.candidateName) {
    return '';
  }
  const {
    title,
    firstName,
    lastName,
  } = candidate.candidateName;
  return title ? `${title} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
};

export const getUntitledCandidateName = (candidate: Candidate): string => {
  if (!candidate.candidateName) {
    return '';
  }
  const {
    firstName,
    lastName,
  } = candidate.candidateName;
  return `${firstName} ${lastName}`;
};

export const selectCandidateDriverNumber = createSelector(
  selectCandidate,
  ({ driverNumber }) => driverNumber,
);

export const getCandidateDriverNumber = (candidate: Candidate) => candidate.driverNumber;

export const formatDriverNumber = (driverNumber: string) => {
  if (driverNumber?.length > 14) {
    return `${driverNumber.slice(0, 5)} ${driverNumber.slice(5, 11)} ${driverNumber.slice(11)}`;
  }
  return driverNumber;
};

export const selectFormatDriverNumber = createSelector(
  selectCandidate,
  ({ driverNumber }) => formatDriverNumber(driverNumber),
);

export const getCandidateEmailAddress = (candidate: Candidate) => (
  candidate.emailAddress ? candidate.emailAddress : ''
);

export const selectCandidateEmailAddress = createSelector(
  selectCandidate,
  ({ emailAddress }) => emailAddress || '',
);

export const getPostalAddress = (candidate: Candidate) => candidate.candidateAddress;

export const selectPostalAddress = createSelector(
  selectCandidate,
  ({ candidateAddress }) => candidateAddress,
);

export const getCandidateId = (candidate: Candidate) => candidate.candidateId;

export const getCandidatePrn = (candidate: Candidate) => candidate.prn;

export const selectCandidatePrn = createSelector(
  selectCandidate,
  ({ prn }) => prn,
);

export const getGender = (candidate: Candidate) => candidate.gender;

export const getDateOfBirth = (candidate: Candidate) => candidate.dateOfBirth;

export const getGenderFullDescription = (
  gender: string,
): string => (gender === 'F') ? 'Female' : 'Male';

export const getGenderSilhouettePath = (
  gender: string,
): string => `assets/imgs/candidate-id/silhouette-${gender === 'F' ? 2 : 1}.png`;
