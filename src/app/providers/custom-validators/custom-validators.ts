import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    const atIndex = value.indexOf('@');
    const dotIndex = value.lastIndexOf('.');

    const isValid = atIndex > -1 && dotIndex > atIndex && dotIndex < value.length - 1;

    return isValid ? null : { emailFormat: true };
  };
}
