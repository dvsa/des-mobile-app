
export enum SpeedCheckState {
  VALID = 'valid',
  NOT_MET = 'not met',
  EMERGENCY_STOP_SERIOUS_FAULT = 'emergency stop serious fault',
  EMERGENCY_STOP_DANGEROUS_FAULT = 'emergency stop dangerous fault',
  EMERGENCY_STOP_AND_AVOIDANCE_MISSING = 'emergency stop and avoidance first attempt missing',
  EMERGENCY_STOP_MISSING = 'emergency stop first attempt missing',
  AVOIDANCE_MISSING = 'avoidance first attempt missing',
}
