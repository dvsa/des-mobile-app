export type RekeyReasonModel = {
  uploadStatus: RekeyReasonUploadModel,
};

export type RekeyReasonUploadModel = {
  isUploading: boolean,
  hasUploadSucceeded: boolean,
  hasUploadFailed: boolean,
  isDuplicate: boolean,
  hasStaffNumberFailedValidation: boolean,
};
