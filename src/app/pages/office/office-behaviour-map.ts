import { OutcomeBehaviourMapping } from '@providers/outcome-behaviour-map/outcome-behaviour-map.model';

export const behaviourMap: OutcomeBehaviourMapping = {
  1: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'Y' },
    showMeQuestion: { display: 'Y' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'A' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'A' },
    eco: { display: 'A' },
  },
  2: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'Y' },
    showMeQuestion: { display: 'Y' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'A' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'A' },
    eco: { display: 'A' },
  },
  3: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y', defaultValue: 'Yes' },
    eta: { display: 'A' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'A' },
    eco: { display: 'A' },
  },
  4: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'A' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'A' },
    eco: { display: 'A' },
  },
  5: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'A' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'A' },
    eco: { display: 'A' },
  },
  11: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  20: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  21: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  22: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  23: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  24: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  25: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  26: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  27: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  28: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  32: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  33: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  34: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    showMeQuestion: { display: 'N' },
    tellMeQuestion: { display: 'A' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  35: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  36: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  37: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  38: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  40: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  41: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  84: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  51: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  52: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  55: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  58: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  59: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  60: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  61: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  62: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  63: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  64: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  66: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  67: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  68: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  69: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  70: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  71: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  73: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  74: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'N' },
    debriefWitnessed: { display: 'N' },
    identification: { display: 'N' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  75: {
    routeNumber: { display: 'Y' },
    independentDriving: { display: 'Y', showNotApplicable: true },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'A' },
    showMeQuestion: { display: 'Y', showNotApplicable: true },
    weatherConditions: { display: 'Y' },
    d255: { display: 'Y' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  82: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
  83: {
    routeNumber: { display: 'N' },
    independentDriving: { display: 'N' },
    candidateDescription: { display: 'Y' },
    debriefWitnessed: { display: 'Y' },
    identification: { display: 'Y' },
    tellMeQuestion: { display: 'N' },
    showMeQuestion: { display: 'N' },
    weatherConditions: { display: 'N' },
    d255: { display: 'N' },
    eta: { display: 'N' },
    additionalInformation: { display: 'Y' },
    faultComment: { display: 'N' },
    eco: { display: 'N' },
  },
};
