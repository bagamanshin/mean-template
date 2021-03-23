import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function CoincideValidator(controlName: string, matchingControlName: string): ValidatorFn{
    return (formGroup: FormGroup): ValidationErrors => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors && !matchingControl.errors.coincideValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ coincideValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
