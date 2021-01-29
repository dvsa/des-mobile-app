export enum manoeuvreTypeLabelsCatHomeTest {
  reverseLeft = 'Reverse',
}

interface ManoeuvreCompetencyLabel {
  [key: string]: 'Control' | 'Observation';
}

export const manoeuvreCompetencyLabelsCatHomeTest: ManoeuvreCompetencyLabel = {
  controlFault: 'Control',
  observationFault: 'Observation',
};
