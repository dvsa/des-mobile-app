export enum ErrorTypes {
  JOURNAL_REFRESH = 'journal',
  SEARCH = 'search',
  SEARCH_RESULT = 'search results',
  JOURNAL_DATA_MISSING = 'journal data missing',
  TEST_CENTRE_JOURNAL_NO_RESULT = 'User does not have a corresponding row in test centre table',
  TEST_CENTRE_JOURNAL_ERROR = 'Unable to retrieve test centre journal',
  TEST_CENTRE_OFFLINE = 'Offline whilst trying to access Test Centre Journal',
  TEST_CENTRE_UNKNOWN_ERROR = 'Test centre journal error',
}
