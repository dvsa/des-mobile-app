export enum manoeuvreTypeLabels {
	reverseLeft = 'Reverse left',
	reverseRight = 'Reverse right',
	reverseParkRoad = 'Reverse park (road)',
	reverseParkCarpark = 'Reverse park (car park)',
	forwardPark = 'Forward park',
}

export enum manoeuvreTypeAnalyticLabels {
	reverseLeft = 'reverse_left',
	reverseRight = 'reverse_right',
	reverseParkRoad = 'reverse_road',
	reverseParkCarpark = 'reverse_car_park',
	forwardPark = 'forward_park',
}

interface ManoeuvreCompetencyLabel {
	[key: string]: 'Control' | 'Observation';
}

export const manoeuvreCompetencyLabels: ManoeuvreCompetencyLabel = {
	controlFault: 'Control',
	observationFault: 'Observation',
};
export const manoeuvreCompetencyAnalyticLabels = {
	controlFault: 'control',
	observationFault: 'observation',
};
