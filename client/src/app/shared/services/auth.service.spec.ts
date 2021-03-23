import {getTestBed, TestBed} from '@angular/core/testing';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {AuthService} from './auth.service';
import { TokenInterceptor } from '../interceptors/token.interceptor';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { roles } from '../interfaces';

describe('Auth service', () => {

  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],

      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        }
      ]

    });

    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router)
  });

  it('should created', () => {
    expect(service).toBeTruthy();
  });
  it('should populate tokens after login', done => {
    const mockLoginData = {
      jwtToken: 'accessToken',
      refreshToken: 'refreshToken'
    };
    service.login({
      email: 'admin@mail.ru',
      password: 'admin'
    })
    .subscribe(
      result => {
        expect(service.getAccessToken()).toBeTruthy('Access token can\'t be falsy')
        expect(service.getRefreshToken()).toBeTruthy('Refresh token can\'t be falsy')
        expect(localStorage.getItem('accessToken')).toBe(service.getAccessToken());
        expect(localStorage.getItem('refreshToken')).toBe(service.getRefreshToken());
        done();
      }
    )
    const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
    expect(httpLoginRequest.request.method).toBe('POST');
    httpLoginRequest.flush(mockLoginData);
  });
  it('should add Authorization header after successful authentication', done => {

    const mockLoginData = {
      jwtToken: 'accessToken',
      refreshToken: 'refreshToken'
    };

    service.login({
      email: 'admin@mail.ru',
      password: 'admin'
    })
    .subscribe(response => {
      expect(response).toBeTruthy();

      service
        .checkAuth()
        .subscribe(
          userList => {
            done();
          }
          );
          const mockUserList = [];
          const httpCheckAuthRequest = httpMock.expectOne('http://127.0.0.1:4000/users');
          expect(httpCheckAuthRequest.request.method).toBe('GET');
          httpCheckAuthRequest.flush(mockUserList);
          expect(httpCheckAuthRequest.request.headers.has('Authorization')).toEqual(true);
          expect(httpCheckAuthRequest.request.headers.get('Authorization')).toBe(
            `Bearer ${service.getAccessToken()}`,
            );
    });

    const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
    expect(httpLoginRequest.request.method).toBe('POST');
    httpLoginRequest.flush(mockLoginData);
  });
  it('should register user', () => {
    service.register({
      email: 'newuser@mail.ru',
      password: 'password'
    }).pipe(
      tap(
        result => expect(result).toBeTruthy()
      )
    )
  });
  it('should save tokens', () => {
    const accessToken = '123';
    const refreshToken = '123';
    service.setAccessToken(accessToken);
    service.setRefreshToken(refreshToken);
    expect(service.getAccessToken()).toBe(accessToken);
    expect(service.getRefreshToken()).toBe(refreshToken);

  });
  it('should logout without saved tokens', () => {
    service.logout();
    expect(service.getUserRole()).toBe(roles.GUEST);
  })
  it('should logout with saved tokens', done => {
    const mockLoginData = {
      jwtToken: 'new accessToken',
      refreshToken: 'new refreshToken'
    };
    const navigateSpy = spyOn(router, 'navigate');
    service.login({
      email: 'admin@mail.ru',
      password: 'admin'
    }).subscribe(
      () => {
        service.logout();
        expect(service.getAccessToken()).toBe(null);
        expect(service.getRefreshToken()).toBe(null);
        expect(localStorage.getItem('accessToken')).toBe(null);
        expect(localStorage.getItem('refreshToken')).toBe(null);
        // expect(navigateSpy).toHaveBeenCalledWith(['/login']);
        expect(service.getUserRole()).toBe(roles.GUEST);
        done();
      }
    )
    const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
    httpLoginRequest.flush(mockLoginData);
  })
  it('should remove token from Local Storage', () => {
    const accessToken = '123';
    const nullValue = null;
    service.updateTokenInLocalStorage(accessToken, 'accessToken');
    expect(localStorage.getItem('accessToken')).toBe(accessToken);
    service.updateTokenInLocalStorage(nullValue, 'accessToken');
    expect(localStorage.getItem('accessToken')).toBe(nullValue);
  })
  it('shouldn\'t login', done => {
    const mockLoginData = {
      jwtToken: 'new accessToken',
      refreshToken: 'new refreshToken'
    };
    service.login({
      email: 'admin@mail.ru',
      password: 'admin'
    }).subscribe(
      result => {
        expect(result).toBe(false);
        done();
      }
    );
    const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
    httpLoginRequest.flush(
      { errorMessage: 'Server error!' },
      { status: 404, statusText: 'Internal Server Error' }
    );
  })
  afterEach(() => {
    service.logout();
    httpMock.verify();
  });
});
