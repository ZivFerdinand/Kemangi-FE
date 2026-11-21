import { AbstractControl, ValidationErrors } from '@angular/forms';

export function requiredTrimmed(
  control: AbstractControl
): ValidationErrors | null {
  return control.value && control.value.toString().trim() !== ''
    ? null
    : { required: true };
}
