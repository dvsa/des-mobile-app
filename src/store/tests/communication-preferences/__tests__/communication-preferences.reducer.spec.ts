import { CommunicationPreferences } from '@dvsa/mes-test-schema/categories/common';
import { communicationPreferencesReducer } from '../communication-preferences.reducer';
import {
  CandidateChoseEmailAsCommunicationPreference,
  CandidateChosePostAsCommunicationPreference,
  CandidateChoseToProceedWithTestInWelsh,
  CandidateChoseToProceedWithTestInEnglish,
  PopulateConductedLanguage,
} from '../communication-preferences.actions';

describe('communicationPreferencesReducer', () => {

  describe('CANDIDATE_CONFIRMED_COMMUNICATION_PREFERENCE_AS_EMAIL', () => {
    it('should correctly set the communication preference as email and set the email address', () => {
      const emailAddress: string = 'example@example.com';
      const action = CandidateChoseEmailAsCommunicationPreference(emailAddress, 'Post');
      const result: CommunicationPreferences = communicationPreferencesReducer(null, action);
      expect(result.communicationMethod).toEqual('Email');
      expect(result.updatedEmail).toEqual(emailAddress);
    });
  });
  describe('CANDIDATE_CONFIRMED_COMMUNICATION_PREFERENCE_AS_POST', () => {
    it('should set the communication preference as post', () => {
      const action = CandidateChosePostAsCommunicationPreference('Post');
      const result: CommunicationPreferences = communicationPreferencesReducer(null, action);
      expect(result.communicationMethod).toEqual('Post');
    });
  });
  describe('CANDIDATE_CHOSE_TO_PROCEED_WITH_TEST_IN_WELSH', () => {
    it('should set conducted language as Cymraeg', () => {
      const action = CandidateChoseToProceedWithTestInWelsh('Cymraeg');
      const result: CommunicationPreferences = communicationPreferencesReducer(null, action);
      expect(result.conductedLanguage).toEqual('Cymraeg');
    });
  });
  describe('CANDIDATE_CHOSE_TO_PROCEED_WITH_TEST_IN_ENGLISH', () => {
    it('should set conducted language as English', () => {
      const action = CandidateChoseToProceedWithTestInEnglish('English');
      const result: CommunicationPreferences = communicationPreferencesReducer(null, action);
      expect(result.conductedLanguage).toEqual('English');
    });
  });
  describe('POPULATE_CONDUCTED_LANGUAGE', () => {
    it('should set the language as Cymraeg if it is provided in the action', () => {
      const action = PopulateConductedLanguage('Cymraeg');
      const mockState: CommunicationPreferences = {
        conductedLanguage: 'Not provided',
        communicationMethod: 'Not provided',
        updatedEmail: '',
      };
      const result: CommunicationPreferences = communicationPreferencesReducer(mockState, action);
      expect(result.conductedLanguage).toEqual('Cymraeg');
    });
    it('should set the language as English if it is provided in the action', () => {
      const action = PopulateConductedLanguage('English');
      const mockState: CommunicationPreferences = {
        conductedLanguage: 'Not provided',
        communicationMethod: 'Not provided',
        updatedEmail: '',
      };
      const result: CommunicationPreferences = communicationPreferencesReducer(mockState, action);
      expect(result.conductedLanguage).toEqual('English');
    });
    it('should not update the language if it has already been set', () => {
      const action = PopulateConductedLanguage('Cymraeg');
      const mockState: CommunicationPreferences = {
        conductedLanguage: 'English',
        communicationMethod: 'Not provided',
        updatedEmail: '',
      };
      const result: CommunicationPreferences = communicationPreferencesReducer(mockState, action);
      expect(result.conductedLanguage).toEqual('English');
    });
  });
});
