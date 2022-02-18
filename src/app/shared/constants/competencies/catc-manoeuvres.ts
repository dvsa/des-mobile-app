export enum manoeuvreTypeLabelsCatC {
  reverseLeft = 'Reverse',
  reverseManoeuvre = 'Reverse',
}

interface ManoeuvreCompetencyLabel {
  [key: string]: 'Control' | 'Observation';
}

export const manoeuvreCompetencyLabelsCatC: ManoeuvreCompetencyLabel = {
  controlFault: 'Control',
  observationFault: 'Observation',
};
