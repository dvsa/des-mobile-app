import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

export interface IAnalyticsProvider {
  setCurrentPage(name: string): void;

  addCustomDimension(key: number, value: string): void;

  logEvent(category: TestCategory, event: string, label?: string, params?: any): void;

  logError(type: string, message: string): void;

  logException(message: string, fatal: boolean): void;

  setUserId(userId: string): void;
  initialiseAnalytics(): Promise<any>;
}

export enum AnalyticsScreenNames {
  COMMUNICATION = 'communication screen',
  HEALTH_DECLARATION = 'health declaration screen',
  JOURNAL = 'journal screen',
  PASS_TEST_SUMMARY = 'pass test summary screen',
  FAIL_TEST_SUMMARY = 'fail test summary screen',
  PASS_FINALISATION = 'pass finalisation screen',
  TEST_REPORT = 'test report screen',
  TERMINATE_TEST = 'terminate test screen',
  WAITING_ROOM = 'waiting room screen',
  WAITING_ROOM_TO_CAR = 'waiting room to car screen',
  WELCOME = 'welcome screen',
  CANDIDATE_DETAILS = 'candidate details screen',
  PASS_DEBRIEF = 'pass debrief screen',
  FAIL_DEBRIEF = 'fail debrief screen',
  LOGIN = 'login screen',
  BACK_TO_OFFICE = 'back to office screen',
  TEST_RESULTS_SEARCH = 'test result search screen',
  VIEW_TEST_RESULT = 'view test result screen',
  POST_DEBRIEF_HOLDING = 'post debrief holding screen',
  NON_PASS_FINALISATION = 'non pass finalisation',
  REKEY_SEARCH = 'rekey search screen',
  REKEY_REASON = 'rekey reason screen',
  REKEY_UPLOADED = 'rekey uploaded screen',
  DASHBOARD = 'dashboard screen',
  VEHICLE_CHECKS = 'vehicle checks screen',
  REVERSE_DIAGRAM = 'reverse diagram screen',
}

export enum AnalyticsEventCategories {
  CLICK = 'click',
  TEST_LIFECYCLE = 'test lifecycle',
  ERROR = 'error',
  JOURNAL = 'journal',
  AUTHENTICATION = 'authentication',
  BACK_TO_OFFICE = 'back to office',
  POST_TEST = 'post-test',
  TEST_REPORT = 'test report',
  TERMINATION = 'test termination',
  PRACTICE_TEST = 'practice test',
  PRACTICE_MODE = 'practice mode',
  TEST_RESULTS_SEARCH = 'test results search',
  REKEY_SEARCH = 'rekey search',
  REKEY = 'rekey',
  VEHICLE_CHECKS = 'vehicle checks',
  WAITING_ROOM = 'waiting room',
  WAITING_ROOM_TO_CAR = 'waiting room to car',
  OFFICE = 'office',
  DELEGATED_TEST = 'DelExRk',
}

export enum AnalyticsEvents {
  START_TEST = 'start test',
  REKEY_TEST = 'rekey test',
  END_TEST = 'end test',
  APP_LOAD = 'app load',
  SLOT_CHANGED = 'slot changed',
  SLOT_CHANGE_VIEWED = 'slot change viewed',
  NAVIGATION = 'navigation',
  REFRESH_JOURNAL = 'refresh journal',
  DISPLAY_EARLY_START_MODAL = 'display early start modal',
  EXIT_EARLY_START_MODAL_CONTINUE = 'continue to test from early start modal',
  EXIT_EARLY_START_MODAL_RETURN = 'return to journal from early start modal',
  LOGIN = 'login',
  DEFER_WRITE_UP = 'defer write-up',
  SAVE_WRITE_UP = 'save write-up',
  COMPLETE_TEST = 'complete test',
  TEST_DECIDED = 'test decided',
  TEST_IN_WRITE_UP = 'test in write up',
  TEST_AUTOSAVED = 'test autosaved',
  TEST_SUBMITTED = 'test submitted',
  COMPLETE_REKEY_TEST = 'complete rekey test',
  SUBMIT_TEST = 'submit test',
  SUBMIT_REKEY_TEST = 'submit rekey test',
  RESUME_WRITE_UP = 'resume write-up',
  ADD_DRIVING_FAULT = 'add driving fault',
  ADD_SERIOUS_FAULT = 'add serious fault',
  ADD_DANGEROUS_FAULT = 'add dangerous fault',
  REMOVE_DRIVING_FAULT = 'remove driving fault',
  REMOVE_SERIOUS_FAULT = 'remove serious fault',
  REMOVE_DANGEROUS_FAULT = 'remove dangerous fault',
  REMOVE_FAULT = 'remove fault',
  SELECT_SERIOUS_MODE = 'select serious mode',
  SELECT_DANGEROUS_MODE = 'select dangerous mode',
  SELECT_REMOVE_MODE = 'select remove mode',
  APPLICATION_REFERENCE_SEARCH = 'perform application reference search',
  DRIVER_NUMBER_SEARCH = 'perform driver number search',
  LDTM_SEARCH = 'perform ldtm search',
  TOGGLE_LEGAL_REQUIREMENT = 'toggle legal requirement',
  TEST_OUTCOME_CHANGED = 'test outcome changed',
  TEST_BOOKING_SEARCH = 'perform test booking search',
  REVERSE_LEFT_POPOVER_OPENED = 'open reversing manoeuvre',
  REVERSE_LEFT_POPOVER_CLOSED = 'close reversing manoevure',
  REVERSE_DIAGRAM_OPENED = 'open reversing diagram',
  REVERSE_DIAGRAM_CLOSED = 'close reversing diagram',
  REVERSE_DIAGRAM_LENGTH_CHANGED = 'change vehicle length on reversing diagram',
  REVERSE_DIAGRAM_WIDTH_CHANGED = 'change vehicle width on reversing diagram',
  TOGGLE_CODE_78 = 'toggle code 78',
  TOGGLE_LICENSE_RECEIVED = 'toggle licence received',
  D255 = 'set D255',
  GEARBOX_CATEGORY_CHANGED = 'set transmission',
  LANGUAGE_CHANGED = 'language changed',
  CBT_CHANGED = 'cbt changed',
  BIKE_CATEGORY_CHANGED = 'bike category changed',
  BIKE_CATEGORY_SELECTED = 'bike category selected',
  BIKE_CATEGORY_MODAL_TRIGGERED = 'bike category modal triggered',
  TOGGLE_AVOIDANCE_SPEED_REQUIREMENT = 'toggle avoidance speed requirement',
  TOGGLE_EMERGENCY_STOP_SPEED_REQ = 'toggle emergency stop speed requirement',
  RECORD_AVOIDANCE_FIRST_ATTEMPT = 'record avoidance first attempt',
  RECORD_AVOIDANCE_SECOND_ATTEMPT = 'record avoidance second attempt',
  ADD_AVOIDANCE_RIDING_FAULT = 'add driving fault',
  ADD_AVOIDANCE_SERIOUS_FAULT = 'add serious fault',
  ADD_AVOIDANCE_DANGEROUS_FAULT = 'add dangerous fault',
  REMOVE_AVOIDANCE_FAULT = 'remove driving fault',
  RECORD_EMERGENCY_STOP_FIRST_ATTEMPT = 'record emergency stop first attempt',
  RECORD_EMERGENCY_STOP_SECOND_ATTEMPT = 'record emergency stop second attempt',
  ADD_EMERGENCY_STOP_RIDING_FAULT = 'add driving fault',
  ADD_EMERGENCY_STOP_SERIOUS_FAULT = 'add serious fault',
  ADD_EMERGENCY_STOP_DANGEROUS_FAULT = 'add dangerous fault',
  REMOVE_EMERGENCY_STOP_FAULT = 'remove driving fault',
  SPEED_REQ_NOT_MET_MODAL_OPENED = 'speed requirement not met modal opened',
  EMERGENCY_STOP_DANGEROUS_FAULT_MODAL_OPENED = 'emergency stop dangerous fault model opened',
  EMERGENCY_STOP_SERIOUS_FAULT_MODAL_OPENED = 'emergency stop serious fault model opened',
  REMOVE_EMERGENCY_STOP_DANGEROUS_FAULT = 'remove dangerous fault',
  REMOVE_EMERGENCY_STOP_SERIOUS_FAULT = 'remove serious fault',

  PCV_DOOR_EXERCISE_ADD_DRIVING_FAULT = 'add driving fault',
  PCV_DOOR_EXERCISE_ADD_SERIOUS_FAULT = 'add serious fault',
  PCV_DOOR_EXERCISE_ADD_DANGEROUS_FAULT = 'add dangerous fault',
  PCV_DOOR_EXERCISE_REMOVE_DRIVING_FAULT = 'remove driving fault',
  PCV_DOOR_EXERCISE_REMOVE_SERIOUS_FAULT = 'remove serious fault',
  PCV_DOOR_EXERCISE_REMOVE_DANGEROUS_FAULT = 'remove dangerous fault',

  REMOVE_SERIOUS_AVOIDANCE_FAULT = 'remove serious fault',
  REMOVE_DANGEROUS_AVOIDANCE_FAULT = 'remove dangerous fault',
  ADD_DANGEROUS_SINGLE_FAULT = 'add dangerous fault',
  ADD_SERIOUS_SINGLE_FAULT = 'add serious fault',
  ADD_SINGLE_FAULT = 'add driving fault',
  REMOVE_SINGLE_FAULT = 'remove driving fault',
  REMOVE_SERIOUS_SINGLE_FAULT = 'remove serious fault',
  REMOVE_DANGEROUS_SINGLE_FAULT = 'remove dangerous fault',
  CIRCUIT_CHANGED = 'circuit changed',
  INDEPENDENT_DRIVING_TYPE_CHANGED = 'independent driving type changed',
  MODE_OF_TRANSPORT_CHANGED = 'mode of transport changed',
  TOGGLE_CONTROLLED_STOP = 'toggle controlled stop',
  TOGGLE_ECO_PLANNING = 'toggle ECO planning',
  TOGGLE_ECO_CONTROL = 'toggle ECO control',
  TOGGLE_ETA_VERBAL = 'toggle ETA verbal',
  TOGGLE_ETA_PHYSICAL = 'toggle ETA physical',
  START_TIMER = 'start timer',
}

export enum AnalyticsLabels {
  TERMINATE_TEST = 'Test report - legal requirements not met',
  SET_ACTIVITY_CODE = 'Test report - end the test with activity code 4',
}

export enum AnalyticsDimensionIndices {
  DEVICE_ID = 1,
  JOURNAL_DAYS_FROM_TODAY = 2,
  CANDIDATE_WITH_SPECIAL_NEEDS = 3,
  CANDIDATE_WITH_CHECK = 4,
  CANDIDATE_ID = 5,
  APPLICATION_REFERENCE = 6,
  TEST_CATEGORY = 7,
  USER_ID = 11,
}

export enum JournalRefreshModes {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum AnalyticsErrorTypes {
  SUBMIT_FORM_ERROR = 'submit form error',
  VALIDATION_ERROR = 'validation error',
}
