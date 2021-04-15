import {
  AssessmentReportChanged,
} from '../test-summary.cat-cpc.actions';
import {
  IdentificationUsedChanged,
  CandidateDescriptionChanged,
  AdditionalInformationChanged,
  DebriefWitnessed,
  DebriefUnWitnessed,
} from '../../test-summary.actions';
import { testSummaryCPCReducer } from '../test-summary.cat-cpc.reducer';

describe('testSummaryCPCReducer', () => {
  it('should set the assessment report into the state', () => {
    const result = testSummaryCPCReducer({}, AssessmentReportChanged('report'));
    expect(result.assessmentReport).toEqual('report');
  });
  it('should set the identification type into the state', () => {
    const result = testSummaryCPCReducer({}, IdentificationUsedChanged('Licence'));
    expect(result.identification).toEqual('Licence');
  });
  it('should set the additional info into the state', () => {
    const result = testSummaryCPCReducer({}, AdditionalInformationChanged('add info'));
    expect(result.additionalInformation).toEqual('add info');
  });
  it('should change set the candidate description into the state', () => {
    const result = testSummaryCPCReducer({}, CandidateDescriptionChanged('desc'));
    expect(result.candidateDescription).toEqual('desc');
  });
  it('should change set the debrief witnessed to true', () => {
    const result = testSummaryCPCReducer({
      debriefWitnessed: null,
    }, DebriefWitnessed());
    expect(result.debriefWitnessed).toEqual(true);
  });
  it('should change set the debrief witnessed to false', () => {
    const result = testSummaryCPCReducer({
      debriefWitnessed: null,
    }, DebriefUnWitnessed());
    expect(result.debriefWitnessed).toEqual(false);
  });
});
