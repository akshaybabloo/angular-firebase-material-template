import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

/**
 * Validates if the password and confirmPassword are equal or not.
 *
 * @returns An object of `notSame` as `true` if passwords are not same else `null`.
 */
export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password?.value === confirmPassword?.value ? null : {notSame: true};
};
