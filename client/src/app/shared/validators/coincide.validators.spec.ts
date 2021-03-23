import { FormControl, FormGroup, ValidatorFn } from "@angular/forms";
import { CoincideValidator } from "./coincide.validator";

describe('CoincideValidator', () => {
  let formGroup: FormGroup;
  let coincideValidator: ValidatorFn;
  beforeEach(() => {
    formGroup = new FormGroup({
      password: new FormControl(null),
      confirm_password: new FormControl(null)
    });
    coincideValidator = CoincideValidator('password', 'confirm_password');
  })
  it('shouldn\'t set coincide error while passwords match', () => {
    formGroup.controls['password'].setValue(123);
    formGroup.controls['confirm_password'].setValue(123);
    coincideValidator(formGroup);
    const confirm_passwordErrors = formGroup.controls['confirm_password'].errors
    expect(confirm_passwordErrors).not.toEqual(jasmine.objectContaining({
      coincideValidator: true
    }));
  });
  it('should set error to "confirm_password" input', () => {
    formGroup.controls['password'].setValue(123);
    formGroup.controls['confirm_password'].setValue(234);
    coincideValidator(formGroup);
    const confirm_passwordErrors = formGroup.controls['confirm_password'].errors
    expect(confirm_passwordErrors).toEqual(jasmine.objectContaining({
      coincideValidator: true
    }));
  })
});
