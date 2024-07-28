export interface DelegatedRekeySearchError {
  message: DelegatedRekeySearchErrorMessages;
}

export enum DelegatedRekeySearchErrorMessages {
  BookingAlreadyCompleted = 'BookingAlreadyCompleted',
  MappingToTestSlotError = 'Error mapping delegated examiner search response to test slot',
}
