import { Candidate, Name } from '@dvsa/mes-test-schema/categories/common';
import { createSelector } from '@ngrx/store';
import { selectCandidate } from '@store/tests/journal-data/common/candidate/candidate.reducer';

export const formatDriverNumber = (driverNumber: string) => {
  if (driverNumber?.length > 14) {
    return `${driverNumber.slice(0, 5)} ${driverNumber.slice(5, 11)} ${driverNumber.slice(11)}`;
  }
  return driverNumber;
};

export const formatCandidateName = (name: Name, hasTitle: boolean) => {
  if (!name) return '';
  const { title, firstName, lastName } = name;
  return title && hasTitle ? `${title} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
};

export const getCandidateDriverNumber = (candidate: Candidate) => candidate.driverNumber;

export const getCandidateId = (candidate: Candidate) => candidate.candidateId;

export const selectFormatDriverNumber = createSelector(selectCandidate, ({ driverNumber }) =>
  formatDriverNumber(driverNumber)
);

export const selectCandidateName = createSelector(selectCandidate, ({ candidateName }) => {
  return formatCandidateName(candidateName, true);
});

export const selectUntitledCandidateName = createSelector(selectCandidate, ({ candidateName }) => {
  return formatCandidateName(candidateName, false);
});

export const getCandidateName = (candidate: Candidate): string => {
  return formatCandidateName(candidate?.candidateName, true);
};

export const getUntitledCandidateName = (candidate: Candidate): string => {
  return formatCandidateName(candidate?.candidateName, false);
};

export const selectCandidateEmailAddress = createSelector(selectCandidate, ({ emailAddress }) => emailAddress || '');

export const selectPostalAddress = createSelector(selectCandidate, ({ candidateAddress }) => candidateAddress);

export const selectCandidateId = createSelector(selectCandidate, ({ candidateId }) => candidateId);

export const selectCandidatePrn = createSelector(selectCandidate, ({ prn }) => prn);

export const getCandidatePrn = (candidate: Candidate) => candidate?.prn;

export const selectGender = createSelector(selectCandidate, ({ gender }) => gender);

export const selectDateOfBirth = createSelector(selectCandidate, ({ dateOfBirth }) => dateOfBirth);

export const selectGenderFullDescription = createSelector(selectCandidate, ({ gender }) =>
  gender === 'F' ? 'Female' : 'Male'
);

export const selectGenderSilhouettePath = createSelector(
  selectCandidate,
  ({ gender }) => `assets/imgs/candidate-id/silhouette-${gender === 'F' ? 2 : 1}.png`
);
