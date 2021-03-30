import { PreTestDeclarations } from '@dvsa/mes-test-schema/categories/common';

export const getInsuranceDeclarationStatus = (decs: PreTestDeclarations) => decs.insuranceDeclarationAccepted;
export const getResidencyDeclarationStatus = (decs: PreTestDeclarations) => decs.residencyDeclarationAccepted;
export const getSignatureStatus = (decs: PreTestDeclarations) => decs.preTestSignature;
export const getCandidateDeclarationSignedStatus = (decs: PreTestDeclarations) => decs.candidateDeclarationSigned;
