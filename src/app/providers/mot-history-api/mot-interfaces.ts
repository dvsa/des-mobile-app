export interface MotHistory {
  /**
   * Vehicle registration number
   */
  registration: string;
  /**
   * Vehicle make
   */
  make?: string;
  /**
   * Vehicle model
   */
  model?: string;
  /**
   * MOT test expiry date
   */
  expiryDate?: string | null;
  status: MotStatusCodes;
}

/**
 * MOT status codes
 */
export enum MotStatusCodes {
  VALID = "Valid",
  NOT_VALID = "Not valid",
  NO_DETAILS = "No details",
  AGE_EXEMPTION = "Age exemption"
}
