import { Candidate } from '@dvsa/mes-test-schema/categories/common';

export const getCandidateName = (candidate: Candidate): string => {
  if (!candidate.candidateName) {
    return '';
  }
  const { title, firstName, lastName } = candidate.candidateName;
  return title ? `${title} ${firstName} ${lastName}` : `${firstName} ${lastName}`;
};

export const getUntitledCandidateName = (candidate: Candidate): string => {
  if (!candidate.candidateName) {
    return '';
  }
  const { firstName, lastName } = candidate.candidateName;
  return `${firstName} ${lastName}`;
};

export const getCandidateDriverNumber = (candidate: Candidate) => candidate.driverNumber;

export const formatDriverNumber = (driverNumber: string) => {
  if (driverNumber.length > 14) {
    return `${driverNumber.slice(0, 5)} ${driverNumber.slice(5, 11)} ${driverNumber.slice(11)}`;
  }
  return driverNumber;
};

export const getCandidateEmailAddress = (candidate: Candidate) => (
  candidate.emailAddress ? candidate.emailAddress : ''
);

export const getPostalAddress = (candidate: Candidate) => candidate.candidateAddress;

export const getCandidateId = (candidate: Candidate) => candidate.candidateId;

export const getCandidatePrn = (candidate: Candidate) => candidate.prn;

export const getGender = (candidate: Candidate) => candidate.gender;

export const getDateOfBirth = (candidate: Candidate) => candidate.dateOfBirth;
