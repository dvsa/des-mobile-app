
export interface IAnalyticsProvider {

  logException(message: string, fatal: boolean): void;
}

export enum AnalyticsScreenNames {
  COMMUNICATION = 'communication screen',
  HEALTH_DECLARATION = 'health declaration screen',
  JOURNAL = 'journal screen',
  TEST_CENTRE_JOURNAL = 'test centre journal screen',
  PASS_TEST_SUMMARY = 'pass test summary screen',
  FAIL_TEST_SUMMARY = 'fail test summary screen',
  PASS_FINALISATION = 'pass finalisation screen',
  TEST_REPORT = 'test report screen',
  TEST_REPORT_DASHBOARD = 'test report dashboard screen',
  TERMINATE_TEST = 'terminate test screen',
  WAITING_ROOM = 'waiting room screen',
  WAITING_ROOM_TO_CAR = 'waiting room to car screen',
  WELCOME = 'welcome screen',
  CANDIDATE_DETAILS = 'candidate details screen',
  CANDIDATE_LICENCE_INFO = 'candidate licence info screen',
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
  CONFIRM_TEST_DETAILS = 'confirm test details screen',
  FAKE_JOURNAL = 'practice journal screen',
  UN_UPLOADED = 'incomplete tests screen',
  PASS_CERTIFICATES = 'pass certificates screen',
  EXAMINER_RECORDS = 'examiner records screen',
}

export enum AnalyticsEventCategories {
  CLICK = 'click',
  TEST_LIFECYCLE = 'test lifecycle',
  TEST_SUBMISSION = 'test submission',
  ERROR = 'error',
  VALIDATION_ERROR = 'validation error',
  JOURNAL = 'journal',
  TEST_CENTRE_JOURNAL = 'test centre journal',
  AUTHENTICATION = 'authentication',
  BACK_TO_OFFICE = 'back to office',
  POST_TEST = 'post-test',
  TEST_REPORT = 'test report',
  TEST_REPORT_DASHBOARD = 'test report dashboard',
  TEST_END = 'test end',
  PRACTICE_TEST = 'practice test',
  PRACTICE_MODE = 'practice mode',
  TEST_RESULTS_SEARCH = 'test results search',
  REKEY_SEARCH = 'rekey search',
  REKEY = 'rekey',
  VEHICLE_CHECKS = 'vehicle checks',
  WAITING_ROOM = 'waiting room',
  COMMUNICATION = 'communication',
  WAITING_ROOM_TO_CAR = 'waiting room to car',
  OFFICE = 'office',
  DELEGATED_TEST = 'DelExRk',
  DASHBOARD = 'dashboard',
  FAKE_JOURNAL = 'practice mode journal',
  NAVIGATION = 'navigation',
  UN_UPLOADED_TESTS = 'Incomplete Tests',
  APP_UPDATE_BADGE = 'app update badge',
  METADATA = 'metadata',
}

export enum AnalyticsEvents {
  START_TEST = 'start test',
  REPORT_DEVICE_STATE = 'device state',
  REKEY_TEST = 'rekey test',
  END_TEST = 'test ended',
  APP_LOAD = 'app load',
  SLOT_CHANGED = 'slot changed',
  SLOT_CHANGE_VIEWED = 'slot change viewed',
  NAVIGATION = 'navigation',
  REFRESH_JOURNAL = 'refresh journal',
  REFRESH_TC_JOURNAL = 'refresh test centre journal',
  DISPLAY_EARLY_START_MODAL = 'display early start modal',
  EXIT_EARLY_START_MODAL_CONTINUE = 'continue to test from early start modal',
  EXIT_EARLY_START_MODAL_RETURN = 'return to journal from early start modal',
  LOGIN = 'login',
  DEFER_WRITE_UP = 'defer write-up',
  SAVE_WRITE_UP = 'save write-up',
  COMPLETE_TEST = 'complete test',
  TEST_DECIDED = 'test decided',
  SET_ACTIVITY_CODE = 'set activity code',
  TEST_IN_WRITE_UP = 'test in write up',
  TEST_AUTOSAVED = 'test autosaved',
  TEST_SUBMITTED = 'test submitted',
  COMPLETE_REKEY_TEST = 'complete rekey test',
  SUBMIT_TEST = 'submit test',
  SUBMIT_REKEY_TEST = 'submit rekey test',
  RESUME_WRITE_UP = 'resume write-up',
  VRN_CAPTURE = 'vrn capture',
  VRN_CAPTURE_SELECTED = 'vrn capture selected',
  VRN_CAPTURE_CANCELLED = 'vrn capture canceled',
  VRN_CAPTURE_SAVED = 'vrn capture saved',
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
  EXIT_REMOVE_MODE = 'exit remove mode',
  REMOVE_MODE_SELECTED = 'remove mode selected',
  REMOVE_MODE_EXITED = 'remove mode exited',
  RETURN_TO_TEST = 'return to test',
  APPLICATION_REFERENCE_SEARCH = 'perform application reference search',
  DRIVER_NUMBER_SEARCH = 'perform driver number search',
  LDTM_SEARCH = 'perform ldtm search',
  TOGGLE_LEGAL_REQUIREMENT = 'toggle legal requirement',
  TEST_OUTCOME_CHANGED = 'test outcome changed',
  TEST_BOOKING_SEARCH = 'perform test booking search',
  REVERSE_LEFT_POPOVER_OPENED = 'open reversing manoeuvre',
  REVERSE_LEFT_POPOVER_CLOSED = 'close reversing manoeuvre',
  REVERSE_DIAGRAM_OPENED = 'open reversing diagram',
  REVERSE_DIAGRAM_CLOSED = 'close reversing diagram',
  REVERSE_DIAGRAM_LENGTH_CHANGED = 'change vehicle length on reversing diagram',
  REVERSE_DIAGRAM_WIDTH_CHANGED = 'change vehicle width on reversing diagram',
  TOGGLE_CODE_78 = 'toggle code 78',
  TOGGLE_LICENSE_RECEIVED = 'toggle licence received',
  D255 = 'set D255',
  GEARBOX_CATEGORY_CHANGED = 'set transmission',
  MOT_STATUS_CHANGED = 'set mot status',
  LANGUAGE_CHANGED = 'language changed',
  CBT_CHANGED = 'cbt changed',
  BIKE_CATEGORY_CHANGED = 'bike category changed',
  DUAL_CONTROLS_CHANGED = 'dual controls changed',
  PDI_LOGBOOK_CHANGED = 'pdi logbook changed',
  TRAINEE_LICENCE_CHANGED = 'trainee licence changed',
  ORDIT_TRAINED_CHANGED = 'ordit trained changed',
  TRAINER_REG_NUMBER_CHANGED = 'trainer reg number changed',
  FEEDBACK_CHANGED = 'feedback changed',
  STUDENT_LEVEL_CHANGED = 'student level changed',
  LESSON_THEMES_CHANGED = 'lesson themes changed',
  LESSON_THEME_ADDED = 'lesson theme added',
  LESSON_THEME_REMOVED = 'lesson theme removed',
  OTHER_REASON_CHANGED = 'other reason changed',
  LESSON_PLANNING_CHANGED = 'lesson planning changed',
  RISK_MANAGEMENT_CHANGED = 'risk management changed',
  TEACHING_LEARNING_STRATEGY_CHANGED = 'teaching learning strategy changed',
  ASSESSMENT_OVERALL_SCORE_CHANGED = 'assessment overall score changed',
  FURTHER_DEVELOPMENT_CHANGED = 'seek further development changed',
  REASON_FOR_NO_ADVICE_CHANGED = 'reason for no advice changed',
  ASSESSMENT_MODAL_OPENED = 'assessment modal opened',
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
  TOGGLE_FUEL_EFFICIENT_DRIVING = 'toggle fuel efficient driving',
  ECO_RELATED_FAULT_CHANGED = 'eco related fault changed',
  ECO_CAPTURE_REASON_CHANGED = 'eco capture reason changed',
  TOGGLE_ETA_VERBAL = 'toggle ETA verbal',
  TOGGLE_ETA_PHYSICAL = 'toggle ETA physical',
  START_TIMER = 'start timer',
  DATE_OF_TEST_CHANGED = 'date of test changed',
  CONFIRM_UPLOAD = 'Confirm upload',
  PRACTICE_TEST_SELECTED = 'practice test report selected',
  PRACTICE_FULL_TEST_SELECTED = 'practice full test selected',
  BACK = 'back',
  ASAM = 'Single App Mode (SAM)',
  SIDE_MENU = 'burger menu',
  TEST_SELECTED = 'test selected',
  CHANGE_LOCATION = 'change location',
  TAB_SELECTION = 'tab selection',
  BUTTON_SELECTION = 'button selection',
  EXAMINER_SELECTION = 'examiner selection',
  CANDIDATE_SELECTION = 'candidate selection',
  CANDIDATE_RECEIVE_TEST_RESULTS = 'candidate receive test results',
}

export enum AnalyticsLabels {
  TERMINATE_TEST = 'Test report - test terminated',
  TEST_ENDED = 'Test report - test ended',
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
  DEVICE_MODEL = 12,
}

export enum JournalRefreshModes {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
}

export enum AnalyticsErrorTypes {
  SUBMIT_FORM_ERROR = 'submit form error',
  VALIDATION_ERROR = 'validation error',
}

export enum GoogleAnalyticsEventPrefix {
  PRACTICE_MODE = 'PM',
  DELEGATED_TEST = 'DX',
  REKEY = 'RM',
}

/**
 * Enum representing the custom dimensions for Google Analytics.
 * @enum {string}
 */
export enum GoogleAnalyticsCustomDimension {
  DEVICE_ID = 'device_id',
  JOURNAL_DAYS_FROM_TODAY = 'journal_days_from_today',
  CANDIDATE_WITH_SPECIAL_NEEDS = 'candidate_with_special_needs',
  CANDIDATE_WITH_CHECK = 'candidate_with_check',
  CANDIDATE_ID = 'candidate_id',
  APPLICATION_REFERENCE = 'application_reference',
  TEST_CATEGORY = 'test_category',
  USER_ID = 'unique_user_id',
  DEVICE_MODEL = 'device_model',
  APP_VERSION = 'app_version',
}

export enum GoogleAnalyticsEvents {
  START_TEST = 'start_test',
  RETURN_TO_TEST = 'return_to_test',
  TEST_OUTCOME_CHANGED = 'test_outcome_changed',
  MICROSERVICE_ERROR = 'microservice_error',
  TEST_SUBMISSION = 'test_submission',
  FURTHER_DEVELOPMENT = 'further_development',
  SET_ACTIVITY_CODE = 'set_activity_code',
  LANGUAGE_CHANGED = 'language_changed',
  LICENCE_RECEIVED = 'licence_received',
  DATE_OF_TEST = 'date_of_test',
  CODE73 = 'code_73',
  CODE78 = 'code_78',
  FEEDBACK = 'feedback',
  LESSON_PLANNING = 'lesson_planning',
  LESSON_THEME = 'lesson_theme',
  RISK_MANAGEMENT = 'risk_management',
  LEARNING_STRATEGY = 'learning_strategy',
  OVERALL_ASSESSMENT = 'overall_assessment',
  ADD_FAULT = 'add_fault',
  ADD_SINGLE_FAULT = 'add_single_fault',
  FUEL_EFFICIENT_DRIVING = 'fuel_efficient_driving',
  TRANSPORT_MODE = 'transport_mode',
  INDEPENDENT_DRIVING = 'independent_driving',
  CIRCUIT_CHANGED = 'circuit_changed',
  UPLOAD_CONFIRMED = 'upload_confirmed',
  SAVE_WRITE_UP = 'save_write_up',
  TEST_CENTRE_JOURNAL = 'test_centre_journal',
  RESUME_WRITE_UP = 'resume_write_up',
  BALANCE_QUESTION = 'balance_Q',
  SAFETY_QUESTION = 'safety_Q',
  TELL_ME_QUESTION = 'tell_me_Q',
  SHOW_ME_QUESTION = 'show_me_Q',
  COMPLETED_TEST_SEARCH = 'completed_test_search',
  LDTM_SEARCH = 'ldtm_search',
  SUBMIT_FORM_ERROR = 'submit_form_error',
  SUBMIT_TEST = 'submit_test',
  VALIDATION_ERROR = 'validation_error',
  CANDIDATE_RECEIVE_TEST_RESULTS = 'send_candidate_test_results',
  SET_D255 = 'set_d255',
  BIKE_CATEGORY_CHANGED = 'bike_category_changed',
  DUAL_CONTROLS = 'dual_controls',
  BIKE_CATEGORY_SELECTED = 'bike_category_selected',
  NAVIGATION = 'navigation',
  VEHICLE_LENGTH = 'vehicle_length',
  VEHICLE_WIDTH = 'vehicle_width',
  SET_TRANSMISSION = 'set_transmission',
  PDI_LOGBOOK = 'pdi_logbook',
  TRAINEE_LICENCE = 'trainee_licence',
  ORDIT_TRAINER = 'ordit_trainer',
  TRAINER_REG_NUMBER = 'trainer_reg_number',
  MOT_CHECK = 'mot_check',
  VRN_CAPTURE = 'vrn_capture',
  JOURNAL = 'journal',
  DASHBOARD = 'dashboard',
  PRACTICE_MODE_NAVIGATION = 'pm_navigation',
  MENU = 'burger_menu',
  METADATA = 'metadata',
  APP_UPDATE = 'app_update_available',
  INCOMPLETE_TESTS = 'incomplete_tests',
  DEFER_WRITE_UP = 'defer_write-up',
  TEST_DECIDED = 'test_decided',
  TEST_IN_WRITE_UP = 'test_in_write_up',
  TEST_AUTOSAVED = 'test_autosaved',
  TEST_SUBMITTED = 'test_submitted',
  ASAM = 'single_app_mode_modal',
  TEST_BOOKING_SEARCH = 'test_booking_search',
  SELECT_MODE = 'select_mode',
  EXIT_MODE = 'exit_mode',
  REMOVE_FAULT = 'remove_fault',
  TEST_ENDED = 'test_ended',
  TEST_TERMINATED = 'test_terminated',
  LEGAL_REQUIREMENT = 'legal_requirement',
  ECO_CONTROL = 'eco_control',
  ECO_PLANNING = 'eco_planning',
  ETA = 'examiner_took_action',
  CONTROLLED_STOP = 'controlled_stop',
  START_TIMER = 'start_timer',
  AVOIDANCE_MANOEUVRE = 'avoidance_manoeuvre',
  EMERGENCY_STOP = 'emergency_stop',
  STUDENT_EXPERIENCE = 'student_experience',
  EXAMINER_RECORDS = 'examiner_records',
}

export enum GoogleAnalyticsEventsTitles {
  REHYDRATION = 'rehydration',
  HDD_FREE_MB = 'hdd_free_mb',
  HDD_TOTAL_MB = 'hdd_total_mb',
  BATTERY_LEVEL = 'battery_level',
  OLD_RESULT = 'old_result',
  NEW_RESULT = 'new_result',
  TEST_DETAILS = 'test_details',
  TEST_SUBMISSION = 'test_submission',
  ACTIVITY_CODE = 'activity_code',
  LANGUAGE = 'language',
  RECEIVED = 'received',
  SEVERITY = 'severity',
  FAULT_TYPE = 'fault_type',
  REASON = 'reason',
  FEEDBACK_CATEGORY = 'feedback_category',
  TEST_CATEGORY = 'test_category',
  DRIVING_TYPE = 'driving_type',
  DIRECTION = 'direction',
  QUESTION_NUMBER = 'question_number',
  QUESTION_SCORE = 'question_score',
  SCORE = 'score',
  BACK = 'back',
  RESULT = 'result',
  SLOT_CHANGED = 'slot_changed',
  ERROR = 'error',
  EARLY_START_MODAL = 'early_start_modal',
  REFRESH = 'refresh',
  NAVIGATION = 'navigation',
  BUTTON_SELECTION = 'button_selection',
  TAB_SELECTION = 'tab_selection',
  CHANGED_FROM = 'changed_from',
  FILTER = 'filter',
  CHANGED_TO = 'changed_to',
  CATEGORY = 'category',
  BLANK_FIELD = 'blank_field',
  OUTCOME = 'outcome',
  MODE = 'mode',
  ITEM_NAME = 'item_name',
  ITEM_STATUS = 'item_status',
  COMMS_CHANNEL = 'comms_channel',
  FINALISATION_D255 = 'd255',
  OPENED = 'opened',
  CLOSED = 'closed',
  SELECTION = 'selection',
  TRANSMISSION_TYPE = 'transmission_type',
  MOT_STATUS = 'mot_status',
  SLOT_VIEWED = 'slot_viewed',
  PRACTICE_TEST_SELECTED = 'practice_test_report_selected',
  FULL_MODE_SELECTED = 'full_mode_selected',
  STATUS = 'status',
  DEVICE_THEME = 'device_theme',
  TEST_STATUS = 'test_status',
  MODAL = 'modal_status',
  FIRST_ATTEMPT = 'first_attempt',
  SECOND_ATTEMPT = 'second_attempt',
  SPEED_REQ = 'speed_req',
  LEVEL = 'level',
  ADDED = 'added',
  REMOVED = 'removed',
  LOCATION_FILTER = 'location_filter',
  TEST_CATEGORY_FILTER = 'test_category_filter',
  DATE_RANGE_CHANGED = 'date_range_filter',
  GREYSCALE_COLOUR = 'greyscale_scheme',
  DEFAULT_COLOUR = 'default_scheme',
  CHART_VISUALISATION = 'chart_visualisation',
  TAP_TO_SHOW = 'tap_to_show_data',
  TAP_TO_HIDE = 'tap_to_hide_data',
  DATA_UNAVAILABLE = 'data_unavailable',
}

export enum GoogleAnalyticsEventsValues {
  ERROR = 'error',
  NULL = 'null',
  FULL = 'full',
  PARTIAL = 'partial',
  COMPLETED = 'completed',
  NO_ADVICE_REASON = 'no_advice_reason',
  REVERSE_DIAGRAM = 'reverse_diagram',
  ECO = 'eco',
  CAR_TO_BIKE = 'car_to_bike',
  BIKE_TO_BIKE = 'bike_to_bike',
  SAT_NAV = 'sat_nav',
  DIAGRAM = 'diagram',
  TRAFFIC_SIGNS = 'traffic_signs',
  NOT_APPLICABLE = 'not_applicable',
  LEFT = 'left',
  RIGHT = 'right',
  TERMINATED = 'terminated',
  PASS = 'pass',
  FAIL = 'fail',
  DEBRIEF = 'debrief',
  FINALISE_OUTCOME = 'finalise_outcome',
  CORRECT = 'correct',
  DRIVING_FAULT = 'driving_fault',
  APP_REF = 'app_ref',
  DRIVER_NUMBER = 'driver_number',
  VRN_CAPTURE_SELECTED = 'selected',
  VRN_CAPTURE_CANCELLED = 'cancelled',
  VRN_CAPTURE_SAVED = 'saved',
  COMMS_METHOD_BOOKING_EMAIL = 'booking_email',
  COMMS_METHOD_NEW_EMAIL = 'new_email',
  COMMS_METHOD_POST = 'by_post',
  BIKE_CATEGORY_MODAL = 'bike_category_modal',
  ASSESSMENT_MODAL = 'assessment_modal',
  CANDIDATE = 'candidate',
  JOURNALS = 'journals',
  LOCATION = 'location',
  EXAMINER = 'examiner',
  BOOKINGS = 'bookings',
  YES = 'yes',
  TODAY = 'today',
  TOMORROW = 'tomorrow',
  NO = 'no',
  CONTINUE = 'continue',
  DISPLAY = 'display',
  EXIT = 'exit',
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  OPEN = 'open',
  CLOSE = 'close',
  CLICKED = 'clicked',
  DARK_MODE = 'dark_mode',
  LIGHT_MODE = 'light_mode',
  UNKNOWN = 'unknown',
  TRIGGERED = 'triggered',
  SERIOUS = 'serious',
  DANGEROUS = 'dangerous',
  REMOVE = 'remove',
  ETA_PHYSICAL = 'physical',
  ETA_VERBAL = 'verbal',
  FREE_TEXT_ENTERED = 'free_text_entered',
  MET = 'met',
  NOT_MET = 'not_met',
  SPEED_REQ_NOT_MET = 'speed_req_not_met',
  EMERGENCY_STOP = 'emergency_stop',
  REVERSE_MANOEUVRE = 'reverse_manoeuvre',
  OTHER_REASON = 'other_reason',
  TRAINER_ID_ENTERED = 'trainer_id_entered',
  SELECTED = 'selected',
  UNSELECTED = 'unselected',
  RETURN_TO_DASHBOARD = 'return_to_dashboard',
  DATA_BANNER_DISPLAY = 'data_banner_display',
}
