export interface RegeneratedEmails {
  appRef: number
  emailRegenerationDetails: EmailRegenerationDetail[]
}
export interface EmailRegenerationDetail {
  newEmail: string
  newLanguage: string
  regeneratedDate: string
}
