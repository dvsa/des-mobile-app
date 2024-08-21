export type DataRowListItem = {
  label: string;
  checked: boolean;
};

export enum TestRequirementsLabels {
  normalStop1 = 'Normal stop (NS)',
  normalStop2 = 'Normal stop (NS)',
  busStop1 = 'Bus Stop (BS)',
  busStop2 = 'Bus Stop (BS)',
  angledStart = 'Angled start (AS)',
  hillStart = 'Hill start (HS) / designated stop (DS)',
  uphillStart = 'Uphill start (US)',
  downhillStart = 'Downhill start (DS)',
  angledStartControlledStop = 'Angled start (AS) / controlled stop (CS)',
  uncoupleRecouple = 'Uncouple / recouple',
}

export enum ViewTestResultLabels {
  completed = 'Completed',
  notCompleted = 'Not completed',
  control = 'Control',
  planning = 'Planning',
}
