export enum manoeuvreTypeLabels {
  reverseLeft = 'Reverse',
}

interface ManoeuvreCompetencyLabel {
  [key: string]: 'Control' | 'Observation';
}

export const manoeuvreCompetencyLabels: ManoeuvreCompetencyLabel = {
  controlFault: 'Control',
  observationFault: 'Observation',
};
