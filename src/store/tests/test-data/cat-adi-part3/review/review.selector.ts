import { Review } from '@dvsa/mes-test-schema/categories/ADI3';

export const getImmediateDanger = (data: Review): boolean => data.immediateDanger;
export const getFurtherDevelopment = (data: Review): boolean => data.seekFurtherDevelopment;
export const getReasonForNoAdviceGiven = (data: Review): string => data.reasonForNoAdviceGiven;
export const getFeedback = (data: Review): string => data.feedback;
export const getGrade = (data: Review): string => data.grade || null;
