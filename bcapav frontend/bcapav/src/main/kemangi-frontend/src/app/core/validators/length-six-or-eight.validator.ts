import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function lengthSixOrEight(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) return null;

    const len = value.length;
    return len === 6 || len === 8 ? null : { lengthSixOrEight: true };
  };
}
