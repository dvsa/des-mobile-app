import { ExaminerWorkSchedule } from '@dvsa/mes-journal-schema';

type Examiner = {
  name: string;
  staffNumber: string;
  journal?: ExaminerWorkSchedule | null;
  error?: string;
};

export type TestCentre = {
  id: number;
  name: string;
};

export interface TestCentreDetailResponse {
  staffNumber: string;
  examiners: Examiner[];
  testCentres: TestCentre[];
}
