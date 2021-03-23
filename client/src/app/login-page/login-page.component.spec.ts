import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { LoginPageComponent } from './login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { defaultRouteToRole } from '../shared/interfaces';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule, ReactiveFormsModule
      ],
      providers: [
        AuthService
      ],
      declarations: [ LoginPageComponent ]
    })
    .compileComponents();

    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router)
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should handle success login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.form.setValue({
      email: 'testuser@mail.ru',
      password: '123123123'
    });

    component.onSubmit();
    expect(component.form.disabled).toBe(true);

    const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
    httpLoginRequest.flush({
      jwtToken: 'the first accessToken',
      refreshToken: 'the first refreshToken'
    });
    expect(navigateSpy).toHaveBeenCalledWith([defaultRouteToRole[service.getUserRole()]]);
    expect(component.authSub).toBeTruthy();
    expect(component.form.disabled).toBe(false);
  });
  it('should handle failed login', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.form.setValue({
      email: 'testuser@mail.ru',
      password: '123123123'
    });

    component.onSubmit();
    expect(component.form.disabled).toBe(true);

    const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
    httpLoginRequest.flush(
      { errorMessage: 'Server error!' },
      { status: 404, statusText: 'Login error' }
    );
    expect(navigateSpy).not.toHaveBeenCalledWith([defaultRouteToRole[service.getUserRole()]]);
    expect(component.form.disabled).toBe(false);
  })
});
