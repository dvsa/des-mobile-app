export type FieldValidators = {
  pattern: RegExp;
  maxLength: string;
  maxByteLength?: number;
};

// Used for when you want to check value does not have a leading zero
export const leadingZero: RegExp = /^0*/g;

// Used for when you want to replace all parts of input except numbers 0-9
export const nonNumericValues: RegExp = /[^0-9]/g;

// Used for when you want to replace all parts of input except numbers 0-9 and alpha A-Z insensitive
export const nonAlphaNumericValues: RegExp = /[^A-Z0-9]/gi;

export const getByteCount = (str: string): number => Buffer.byteLength(str, 'utf8');

export const getRegistrationNumberValidator = (): FieldValidators => {
  return {
    pattern: /^[A-Z0-9]{1,7}$/gi,
    maxLength: '7',
  };
};

export const getInstructorRegistrationNumberValidator = (): FieldValidators => {
  return {
    pattern: /^[1-9][0-9]{0,6}$/g,
    maxLength: '7',
  };
};

export const getTrainerRegistrationNumberValidator = (): FieldValidators => {
  return {
    pattern: /^[1-9][0-9]{0,6}$/g,
    maxLength: '7',
  };
};

export const getSpeedCheckValidator = (): FieldValidators => {
  return {
    pattern: /^[0-9]{0,2}$/g,
    maxLength: '2',
  };
};

export const getPassCertificateAMOD1Validator = (): FieldValidators => {
  return {
    pattern: /^[A-Z][0-9]{5}[%ZYXWVUT/RQP+NMLKJ\-HGFEDC&A9876543210–]$/gi,
    maxLength: '7',
    maxByteLength: 8,
  };
};

export const getDL196CBTCertificateNumberValidator = (): FieldValidators => {
  return {
    pattern: /^\d{7}?$/,
    maxLength: '7',
  };
};
