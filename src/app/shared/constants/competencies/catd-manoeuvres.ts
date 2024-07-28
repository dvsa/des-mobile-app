export enum manoeuvreTypeLabelsCatD {
  reverseLeft = 'Reverse',
}

interface ManoeuvreCompetencyLabel {
  [key: string]: 'Control' | 'Observation';
}

export const manoeuvreCompetencyLabelsCatD: ManoeuvreCompetencyLabel = {
  controlFault: 'Control',
  observationFault: 'Observation',
};
