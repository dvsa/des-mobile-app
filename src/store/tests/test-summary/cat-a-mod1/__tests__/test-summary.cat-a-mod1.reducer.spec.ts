import {
  AdditionalInformationChanged,
  CandidateDescriptionChanged, D255No, D255Yes,
  DebriefUnWitnessed,
  DebriefWitnessed,
  IdentificationUsedChanged,
  TrueLikenessToPhotoChanged, WeatherConditionsChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { CircuitTypeChanged } from '@store/tests/test-summary/cat-a-mod1/test-summary.cat-a-mod1.actions';
import { testSummaryMod1Reducer, initialState } from '../test-summary.cat-a-mod1.reducer';

describe('testSummaryMod1Reducer', () => {
  it('should set trueLikenessToPhoto when the TrueLikenessToPhotoChanged action is received', () => {
    const result = testSummaryMod1Reducer(initialState, TrueLikenessToPhotoChanged(true));
    expect(result.trueLikenessToPhoto).toEqual(true);
  });
  it('should set additionalInformation when the AdditionalInformationChanged action is received', () => {
    const result = testSummaryMod1Reducer(initialState, AdditionalInformationChanged('testData'));
    expect(result.additionalInformation).toEqual('testData');
  });
  it('should set candidateDescription when the CandidateDescriptionChanged action is received', () => {
    const result = testSummaryMod1Reducer(initialState, CandidateDescriptionChanged('testData'));
    expect(result.candidateDescription).toEqual('testData');
  });
  it('should set debriefWitnessed to true when the DebriefWitnessed action is received', () => {
    const result = testSummaryMod1Reducer(initialState, DebriefWitnessed());
    expect(result.debriefWitnessed).toEqual(true);
  });
  it('should set debriefWitnessed to false when the DebriefWitnessed action is received', () => {
    const result = testSummaryMod1Reducer(initialState, DebriefUnWitnessed());
    expect(result.debriefWitnessed).toEqual(false);
  });
  it('should set candidateDescription when the IdentificationUsedChanged action is received', () => {
    const result = testSummaryMod1Reducer(initialState, IdentificationUsedChanged('Licence'));
    expect(result.identification).toEqual('Licence');
  });
  it('should set D255 to true when the D255Yes action is received', () => {
    const result = testSummaryMod1Reducer(initialState, D255Yes());
    expect(result.D255).toEqual(true);
  });
  it('should set D255 to false when the D255No action is received', () => {
    const result = testSummaryMod1Reducer(initialState, D255No());
    expect(result.D255).toEqual(false);
  });
  it('should set weatherConditions when the WeatherConditionsChanged action is received', () => {
    const result = testSummaryMod1Reducer(initialState, WeatherConditionsChanged(['Showers', 'Windy']));
    expect(result.weatherConditions).toEqual(['Showers', 'Windy']);
  });
  it('should set circuitType when the WeatherConditionsChanged action is received', () => {
    const result = testSummaryMod1Reducer(initialState, CircuitTypeChanged('Left'));
    expect(result.circuit).toEqual('Left');
  });
});
