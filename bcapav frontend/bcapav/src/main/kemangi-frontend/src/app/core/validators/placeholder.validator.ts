import { AbstractControl, ValidationErrors } from '@angular/forms';

export function placeholderValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const value = control.value;

  if (!value || value.length === 0) return null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let mustContainEmail = false;
  let invalidEmailFormat = false;

  for (const item of value) {
    if (item.includes('%%')) {
      if (!item.toLowerCase().includes('email')) {
        mustContainEmail = true;
      }
    } else {
      if (!emailRegex.test(item)) {
        invalidEmailFormat = true;
      }
    }
  }

  const errors: ValidationErrors = {};

  if (mustContainEmail) {
    errors['mustContainEmail'] = true;
  }

  if (invalidEmailFormat) {
    errors['invalidEmailFormat'] = true;
  }

  return Object.keys(errors).length ? errors : null;
}
