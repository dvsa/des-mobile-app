import { ActivityCode } from '@dvsa/mes-test-schema/categories/common';
import { ActivityCodes, Adi3ActivityCodes, DelegatedExaminerActivityCodes } from '../../models/activity-codes';

export interface ActivityCodeModel {
  activityCode: ActivityCode;
  description: ActivityCodeDescription | DelegatedActivityCodeDescription;
}

export enum ActivityCodeDescription {
  PASS = 'Pass',
  FAIL = 'Fail',
  FAIL_EYESIGHT = 'Fail due to eyesight',
  FAIL_PUBLIC_SAFETY = 'Fail in the interests of public safety',
  FAIL_CANDIDATE_STOPS_TEST = 'Fail candidate chose to stop test: Already failed',
  MECHANICAL_FAILURE = 'Mechanical failure',
  DOCUMENTS_NOT_PRODUCED = 'Documents not produced',
  VEHICLE_NOT_SUITABLE = 'Vehicle / gear not suitable or no vehicle for test',
  NO_L_PLATES = 'No ‘L’ plates / candidate refused to wear face covering',
  MOTORCYCLE_CANDIDATE_LOST_AND_RETURNED = 'Motorcycle candidate lost and returned too late to DTC',
  MOTORCYCLE_CANDIDATE_LOST_DID_NOT_RETURN = 'Motorcycle candidate lost and did not return to test centre',
  DVSA_RADIO_FAILURE = 'DVSA radio failure',
  DVSA_MOTORCYCLE_BREAKDOWN = 'DVSA motorcycle breakdown',
  LANGUAGE_ISSUES = 'Language issues',
  ACCIDENT = 'Accident: Unable to complete test',
  CANDIDATE_UNDER_INFLUENCE = 'Candidate under the influence of drugs / alcohol',
  CANDIDATE_PREGNANT = 'Pregnant candidate declined to take part in test',
  UNAUTHORISED_OCCUPANT_IN_VEHICLE = 'Unauthorised occupant in vehicle',
  EXAMINER_TAKEN_ILL = 'Examiner taken ill on test',
  CANDIDATE_TAKEN_ILL = 'Candidate taken ill on test',
  CANDIDATE_NOT_HAPPY_WITH_AUTHORISED_OCCUPANT = 'Candidate not happy with DVSA authorised occupant',
  CANDIDATE_ENTERED_MOTORWAY = 'Candidate entered motorway',
  DVSA_MODULE_1_EQUIPMENT_FAILURE = 'DVSA Module 1 equipment failure during test',
  UNAUTHORISED_FILMING = 'Unauthorised filming / recording on test',
  CANDIDATE_FAILED_TO_ATTEND = 'Candidate failed to attend at test centre',
  LATE_CANCELLATION = 'Late cancellation by candidate / school / Mod1 test failed and Mod2 test within short notice',
  CANDIDATE_LATE = 'Candidate late arriving for test',
  EXAMINER_ILL_PRE_TEST = 'Test cancelled due to examiner being ill',
  EXAMINER_ABSENT = 'Test cancelled due to examiner being absent',
  UNABLE_TO_START_TEST_ON_TIME = 'Test cancelled as unable to start test on time',
  BAD_WEATHER_AT_DTC = 'Bad weather at DTC',
  BAD_WEATHER_AT_CANDIDATES_HOME = 'Bad weather at candidate’s home',
  NOT_AVAILABLE_FOR_HOME_TEST_CANDIDATE_FAULT = 'Not available for home test: Candidate’s responsibility',
  NOT_AVAILABLE_FOR_HOME_TEST_EXAMINER_FAULT = 'Not available for home test: Not candidate’s fault',
  BAD_LIGHT = 'Bad light',
  TRAFFIC = 'Traffic congestion',
  NATURAL_DISASTER = 'Natural disaster',
  LICENCE_FAILED_CHECK = 'Licence failed UV check',
  CANDIDATE_REFUSED_TO_SIGN_RESIDENCY_DECLARATION = 'Candidate refused to sign residency declaration',
  CANDIDATE_STOPS_TEST = 'Candidate chose to stop test: Not already failed',
  ILLEGAL_ACTIVITY_FROM_CANDIDATE = 'Test terminated due to alleged illegal activity by candidate',
  INDUSTRIAL_ACTION = 'Test cancelled due to industrial action',
  AUTHORISED_OCCUPANT_INTERVENED_DURING_TEST = 'Authorised occupant intervened during test',
  INCORRECT_LENSE_WORN = 'Test not conducted: Incorrect / no lenses worn',
  SITE_ACCESS_MANAGER_NOT_AVAILABLE = 'Site access manager not available',
  NO_BODY_CAM_AVAILABLE = 'No Bodycam available',
}

export enum DelegatedActivityCodeDescription {
  TEST_NOT_COMPLETED = 'Test not completed',
  TEST_NOT_STARTED = 'Test not started',
  BAD_WEATHER = 'Bad weather',
  EXAMINER_ILL_OR_UNAVAILABLE = 'Examiner ill or unavailable',
  BAD_WEATHER_REBOOK = 'Bad weather: Rebook',
  EXAMINER_ILL_OR_UNAVAILABLE_REBOOK = 'Examiner ill or unavailable: Rebook',
}

export enum Adi3ActivityCodeDescription {
  PASS = 'Pass',
  FAIL = 'Fail',
  FAIL_PUBLIC_SAFETY = 'Fail in the interests of public safety',
  FAIL_CANDIDATE_STOPS_TEST = 'Fail PDI/ADI/Pupil chose to stop test',
  MECHANICAL_FAILURE = 'Mechanical failure',
  DOCUMENTS_NOT_PRODUCED = 'Documents not produced',
  VEHICLE_NOT_SUITABLE = 'Vehicle / gear not suitable or no vehicle for test',
  ACCIDENT = 'Accident: Unable to complete test',
  EXAMINER_TAKEN_ILL = 'Examiner taken ill on test',
  CANDIDATE_TAKEN_ILL = 'PDI/ADI/Pupil taken ill on test',
  CANDIDATE_FAILED_TO_ATTEND = 'PDI/ADI/Pupil failed to attend at test centre',
  LATE_CANCELLATION = 'Late cancellation by PDI/ADI/Pupil',
  CANDIDATE_LATE = 'PDI/ADI/Pupil late arriving for test',
  UNABLE_TO_START_TEST_ON_TIME = 'Test cancelled as unable to start test on time',
  BAD_WEATHER_AT_DTC = 'Bad weather at DTC',
  BAD_WEATHER_AT_CANDIDATES_HOME = 'Bad weather at PDI/ADI/Pupil’s home',
  TRAFFIC = 'Traffic congestion',
  NATURAL_DISASTER = 'Natural disaster',
  INDUSTRIAL_ACTION = 'Test cancelled due to industrial action',
}

export function populateActivityCodeModelList(isDelegatedExaminer?: boolean, isAdi3?: boolean): ActivityCodeModel[] {
  const codeList = [];

  if (isAdi3) {
    Object.keys(Adi3ActivityCodes).forEach((code) => codeList.push({
      activityCode: Adi3ActivityCodes[code],
      description: Adi3ActivityCodeDescription[code],
    }));
  } else {
    Object.keys(ActivityCodes).forEach((code) => codeList.push({
      activityCode: ActivityCodes[code],
      description: ActivityCodeDescription[code],
    }));
  }

  if (isDelegatedExaminer) {
    Object.keys(DelegatedExaminerActivityCodes).forEach((code) => codeList.push({
      activityCode: DelegatedExaminerActivityCodes[code],
      description: DelegatedActivityCodeDescription[code],
    }));
  }

  codeList.sort((a, b) => ((Number(a.activityCode) > Number(b.activityCode)) ? 1 : -1));
  return codeList;
}

export const activityCodeModelListDelegatedExaminer: ActivityCodeModel[] = populateActivityCodeModelList(true);
export const activityCodeModelList: ActivityCodeModel[] = populateActivityCodeModelList(false);
export const adi3activityCodeModelList: ActivityCodeModel[] = populateActivityCodeModelList(false, true);

export function getActivityCodeOptions(delegatedExaminer: boolean, adi3: boolean = false): ActivityCodeModel[] {
  if (delegatedExaminer) return activityCodeModelListDelegatedExaminer;
  if (adi3) return adi3activityCodeModelList;
  return activityCodeModelList;
}
