import { Injectable } from '@angular/core';
import { PASS_CERTIFICATE_LENGTH } from './pass-certificate-validation.constants';

@Injectable()
export class PassCertificateValidationProvider {

  isPassCertificateValid(certificate: string | null): boolean {
    if (!certificate || certificate.length !== PASS_CERTIFICATE_LENGTH) {
      return false;
    }
    if (!this.isLetter(certificate[0])) {
      return false;
    }

    const checkDigit = this.calculateMod37CheckDigit(certificate);

    if (checkDigit === 'invalid') {
      return false;
    }

    if (checkDigit.toUpperCase() !== certificate.toUpperCase()[7]) {
      return false;
    }

    return true;
  }

  isLetter(char: string): boolean {
    return char.length === 1 && char.match(/[a-z]/i) !== null;
  }

  calculateMod37CheckDigit(certificate: string): string {
    const digitMultipliers: number[] = [7, 6, 5, 4, 3, 2];
    const checkDigits: string[] = Array.from('%ZYXWVUT/RQP+NMLKJ-HGFEDC&A9876543210');

    // attempt to convert positions 1 - 6 to numbers
    // and return 'invalid' if any are not a number
    const digit1 = parseInt(certificate[1], 10);
    const digit2 = parseInt(certificate[2], 10);
    const digit3 = parseInt(certificate[3], 10);
    const digit4 = parseInt(certificate[4], 10);
    const digit5 = parseInt(certificate[5], 10);
    const digit6 = parseInt(certificate[6], 10);

    if (
      Number.isNaN(digit1)
      || Number.isNaN(digit2)
      || Number.isNaN(digit3)
      || Number.isNaN(digit4)
      || Number.isNaN(digit5)
      || Number.isNaN(digit6)
    ) {
      return 'invalid';
    }

    // take the 6 digits, apply the multiplier for each digit
    // (defined in digitMultiplier above) and add them together
    // then take the remainder of this value divided by 37.
    const position: number = (
      (digit1 * digitMultipliers[0])
      + (digit2 * digitMultipliers[1])
      + (digit3 * digitMultipliers[2])
      + (digit4 * digitMultipliers[3])
      + (digit5 * digitMultipliers[4])
      + (digit6 * digitMultipliers[5])
    ) % 37;

    // return the check digit from the checkDigits array at the position
    // calculated
    const checkDigit = checkDigits[position];
    return checkDigit;
  }
}
