export interface FieldDetail {
  display: 'A' | 'Y' | 'N';
  defaultValue?: string;
  showNotApplicable?: boolean;
}
export interface Field {
  [k: string]: FieldDetail;
}

export interface OutcomeBehaviourMapping {
  [k: string]: Field;
}
