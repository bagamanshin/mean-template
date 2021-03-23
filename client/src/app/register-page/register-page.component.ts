import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../shared/services/auth.service';
import { CoincideValidator } from '../shared/validators/coincide.validator';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.sass']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  authSub: Subscription

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      confirm_password: new FormControl(null, [Validators.required, Validators.minLength(2)])
    }, {
      validators: [CoincideValidator('password', 'confirm_password')]
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onSubmit() {
    this.form.disable();
    this.authSub = this.auth
      .register(this.form.value)
      .subscribe(
        result => {
          if (result) {
            this.router.navigate(['/login'], {queryParams: {
              registered: true
            }});
          }
          this.form.enable();
        }
      )
  }

}
