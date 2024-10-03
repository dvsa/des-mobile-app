export enum ActivityCodes {
  PASS = '1',
  FAIL = '2',
  FAIL_EYESIGHT = '3',
  FAIL_PUBLIC_SAFETY = '4',
  FAIL_CANDIDATE_STOPS_TEST = '5',
  MECHANICAL_FAILURE = '11',
  DOCUMENTS_NOT_PRODUCED = '20',
  VEHICLE_NOT_SUITABLE = '21',
  NO_L_PLATES = '22',
  MOTORCYCLE_CANDIDATE_LOST_AND_RETURNED = '23',
  MOTORCYCLE_CANDIDATE_LOST_DID_NOT_RETURN = '24',
  DVSA_RADIO_FAILURE = '25',
  DVSA_MOTORCYCLE_BREAKDOWN = '26',
  LANGUAGE_ISSUES = '27',
  ACCIDENT = '28',
  CANDIDATE_UNDER_INFLUENCE = '32',
  CANDIDATE_PREGNANT = '33',
  UNAUTHORISED_OCCUPANT_IN_VEHICLE = '34',
  EXAMINER_TAKEN_ILL = '35',
  CANDIDATE_TAKEN_ILL = '36',
  CANDIDATE_NOT_HAPPY_WITH_AUTHORISED_OCCUPANT = '37',
  CANDIDATE_ENTERED_MOTORWAY = '38',
  DVSA_MODULE_1_EQUIPMENT_FAILURE = '40',
  UNAUTHORISED_FILMING = '41',
  CANDIDATE_FAILED_TO_ATTEND = '51',
  LATE_CANCELLATION = '52',
  CANDIDATE_LATE = '55',
  EXAMINER_ILL_PRE_TEST = '58',
  EXAMINER_ABSENT = '59',
  UNABLE_TO_START_TEST_ON_TIME = '60',
  BAD_WEATHER_AT_DTC = '61',
  BAD_WEATHER_AT_CANDIDATES_HOME = '62',
  NOT_AVAILABLE_FOR_HOME_TEST_CANDIDATE_FAULT = '63',
  NOT_AVAILABLE_FOR_HOME_TEST_EXAMINER_FAULT = '64',
  BAD_LIGHT = '66',
  TRAFFIC = '67',
  NATURAL_DISASTER = '68',
  LICENCE_FAILED_CHECK = '69',
  CANDIDATE_REFUSED_TO_SIGN_RESIDENCY_DECLARATION = '70',
  CANDIDATE_STOPS_TEST = '71',
  ILLEGAL_ACTIVITY_FROM_CANDIDATE = '73',
  INDUSTRIAL_ACTION = '74',
  AUTHORISED_OCCUPANT_INTERVENED_DURING_TEST = '75',
  INCORRECT_LENSE_WORN = '82',
  SITE_ACCESS_MANAGER_NOT_AVAILABLE = '83',
  NO_BODY_CAM_AVAILABLE = '88',
  MOT_INVALID = '89',
}

export enum DelegatedExaminerActivityCodes {
  TEST_NOT_COMPLETED = '76',
  TEST_NOT_STARTED = '77',
  BAD_WEATHER = '78',
  EXAMINER_ILL_OR_UNAVAILABLE = '79',
  BAD_WEATHER_REBOOK = '80',
  EXAMINER_ILL_OR_UNAVAILABLE_REBOOK = '81',
}

export enum Adi3ActivityCodes {
  PASS = '1',
  FAIL = '2',
  FAIL_PUBLIC_SAFETY = '4',
  FAIL_CANDIDATE_STOPS_TEST = '5',
  MECHANICAL_FAILURE = '11',
  DOCUMENTS_NOT_PRODUCED = '20',
  VEHICLE_NOT_SUITABLE = '21',
  ACCIDENT = '28',
  EXAMINER_TAKEN_ILL = '35',
  CANDIDATE_TAKEN_ILL = '36',
  CANDIDATE_FAILED_TO_ATTEND = '51',
  LATE_CANCELLATION = '52',
  CANDIDATE_LATE = '55',
  UNABLE_TO_START_TEST_ON_TIME = '60',
  BAD_WEATHER_AT_DTC = '61',
  BAD_WEATHER_AT_CANDIDATES_HOME = '62',
  TRAFFIC = '67',
  NATURAL_DISASTER = '68',
  INDUSTRIAL_ACTION = '74',
  MOT_INVALID = '89',
}
