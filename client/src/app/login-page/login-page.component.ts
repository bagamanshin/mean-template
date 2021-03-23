import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { defaultRouteToRole } from '../shared/interfaces';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.sass']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup
  authSub: Subscription

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title) {}

  ngOnInit(): void {

    this.title.setTitle('Login page!!');

    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(2)])
    });
    this.route.queryParams.subscribe((params: Params) => {
      // обработка query параметров
      // if (params['registered']) {
      //   // Теперь вы можете войти в систему, используя свои данные
      // } else if (params['accessDenied']) {
      //   // Для начала авторизуйтесь в системе
      // } else if (params['sessionExpired']) {
      //   // Время активности сессии истекло
      // }
    })
  }
  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
  onSubmit() {
    this.form.disable();
    this.authSub = this.auth
      .login(this.form.value)
      .subscribe(
        result => {
          if (result) {
            console.log('AUTH RES', result)
            this.router.navigate([
              this.route.snapshot.queryParams['fromURL'] || defaultRouteToRole[this.auth.getUserRole()]
            ]);
          }
          this.form.enable();
        }
      )
  }
}
