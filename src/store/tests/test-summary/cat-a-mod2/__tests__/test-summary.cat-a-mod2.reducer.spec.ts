import {
  AdditionalInformationChanged,
  CandidateDescriptionChanged,
  D255No,
  D255Yes,
  DebriefUnWitnessed,
  DebriefWitnessed,
  IdentificationUsedChanged,
  IndependentDrivingTypeChanged,
  RouteNumberChanged,
  TrueLikenessToPhotoChanged,
  WeatherConditionsChanged,
} from '@store/tests/test-summary/test-summary.actions';
import { ModeOfTransportChanged } from '@store/tests/test-summary/cat-a-mod2/test-summary.cat-a-mod2.actions';
import { initialState, testSummaryMod2Reducer } from '../test-summary.cat-a-mod2.reducer';

describe('testSummaryMod2Reducer', () => {
  it('should set trueLikenessToPhoto when the TrueLikenessToPhotoChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, TrueLikenessToPhotoChanged(true));
    expect(result.trueLikenessToPhoto)
      .toEqual(true);
  });
  it('should set additionalInformation when the AdditionalInformationChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, AdditionalInformationChanged('testData'));
    expect(result.additionalInformation)
      .toEqual('testData');
  });
  it('should set candidateDescription when the CandidateDescriptionChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, CandidateDescriptionChanged('testData'));
    expect(result.candidateDescription)
      .toEqual('testData');
  });
  it('should set candidateDescription when the RouteNumberChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, RouteNumberChanged(88));
    expect(result.routeNumber)
      .toEqual(88);
  });
  it('should set debriefWitnessed to true when the DebriefWitnessed action is received', () => {
    const result = testSummaryMod2Reducer(initialState, DebriefWitnessed());
    expect(result.debriefWitnessed)
      .toEqual(true);
  });
  it('should set debriefWitnessed to false when the DebriefWitnessed action is received', () => {
    const result = testSummaryMod2Reducer(initialState, DebriefUnWitnessed());
    expect(result.debriefWitnessed)
      .toEqual(false);
  });
  it('should set candidateDescription when the IdentificationUsedChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, IdentificationUsedChanged('Licence'));
    expect(result.identification)
      .toEqual('Licence');
  });
  it('should set candidateDescription when the IdentificationUsedChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, IndependentDrivingTypeChanged('Sat nav'));
    expect(result.independentDriving)
      .toEqual('Sat nav');
  });
  it('should set D255 to true when the D255Yes action is received', () => {
    const result = testSummaryMod2Reducer(initialState, D255Yes());
    expect(result.D255)
      .toEqual(true);
  });
  it('should set D255 to false when the D255No action is received', () => {
    const result = testSummaryMod2Reducer(initialState, D255No());
    expect(result.D255)
      .toEqual(false);
  });
  it('should set weatherConditions when the WeatherConditionsChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, WeatherConditionsChanged(['Showers', 'Windy']));
    expect(result.weatherConditions)
      .toEqual(['Showers', 'Windy']);
  });
  it('should set modeOfTransport when the ModeOfTransportChanged action is received', () => {
    const result = testSummaryMod2Reducer(initialState, ModeOfTransportChanged('Car to bike'));
    expect(result.modeOfTransport)
      .toEqual('Car to bike');
  });
});
