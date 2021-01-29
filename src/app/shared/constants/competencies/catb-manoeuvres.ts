export enum manoeuvreTypeLabels {
  reverseLeft = 'Reverse left',
  reverseRight = 'Reverse right',
  reverseParkRoad = 'Reverse park (road)',
  reverseParkCarpark = 'Reverse park (car park)',
  forwardPark = 'Forward park',
}

interface ManoeuvreCompetencyLabel {
  [key: string]: 'Control' | 'Observation';
}

export const manoeuvreCompetencyLabels: ManoeuvreCompetencyLabel = {
  controlFault: 'Control',
  observationFault: 'Observation',
};
