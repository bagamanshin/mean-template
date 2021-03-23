import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service"
import { TokenInterceptor } from "./token.interceptor";

describe('TokenInterceptor', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        AuthService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    })
    service = TestBed.get(AuthService);
    httpMock = TestBed.get(HttpTestingController);
    router = TestBed.get(Router)
  })

  it('should add an Authorization header', done => {

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
      const mockUserList = ['LOOOOL'];
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
  it(`should:
        login =>
        fail checkAuth =>
        try to refresh tokens =>
        fail refreshing tokens`,
    done => {
      const navigateSpy = spyOn(router, 'navigate');

      service
        .login({
          email: 'admin@mail.ru',
          password: 'admin'
        })
        .pipe(
          tap(response => {
            expect(response).toBeTruthy();
          }),
          switchMap(
            () => new Observable(sub => {
              service
                .checkAuth()
                .subscribe(res => sub.next(res));

              const httpCheckAuthRequest = httpMock.expectOne('http://127.0.0.1:4000/users');
              httpCheckAuthRequest.flush(
                { errorMessage: 'Server error!' },
                { status: 401, statusText: 'Internal Server Error' }
              );

              const httpRefreshTokensRequest = httpMock.expectOne('http://127.0.0.1:4000/users/refresh-token');
              expect(httpRefreshTokensRequest.request.body).toEqual({token: service.getRefreshToken()});
              httpRefreshTokensRequest.flush(
                { errorMessage: 'Server error!' },
                { status: 401, statusText: 'Internal Server Error' }
              );
            })
          ),
          tap(checkAuthResult => {
            console.log('checkAuth result ==>> ', checkAuthResult)
            expect(checkAuthResult).toBe(false);
            expect(navigateSpy).toHaveBeenCalledWith(['/login'], jasmine.any(Object));
          })
        )
        .subscribe(() => done());

      const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
      httpLoginRequest.flush({
        jwtToken: 'the first accessToken',
        refreshToken: 'the first refreshToken'
      });
    }
  );
  it(`should:
        login =>
        fail checkAuth =>
        try to refresh tokens =>
        succeed in refreshin tokens =>
        retry to checkAuth =>
        succeed in checkAuth`,
    done => {
      service
        .login({
          email: 'admin@mail.ru',
          password: 'admin'
        })
        .pipe(
          tap(response => {
            expect(response).toBeTruthy();
          }),
          switchMap(
            () => new Observable(sub => {
              service
                .checkAuth()
                .subscribe(res => sub.next(res));

              const httpCheckAuthRequest = httpMock.expectOne('http://127.0.0.1:4000/users');
              httpCheckAuthRequest.flush(
                { errorMessage: 'Server error!' },
                { status: 401, statusText: 'Internal Server Error' }
              );

              const httpRefreshTokensRequest = httpMock.expectOne('http://127.0.0.1:4000/users/refresh-token');
              expect(httpRefreshTokensRequest.request.body).toEqual({token: service.getRefreshToken()});
              httpRefreshTokensRequest.flush({
                  jwtToken: 'another accessToken',
                  refreshToken: 'another refreshToken'
              });

              const httpCheckAuthRequest2 = httpMock.expectOne('http://127.0.0.1:4000/users');
              httpCheckAuthRequest2.flush(
                ['checkAuth true value']
              );
              expect(httpCheckAuthRequest2.request.headers.get('Authorization')).toBe(
                'Bearer another accessToken',
                );
            })
          ),
          tap(checkAuthResult => {
            console.log('checkAuth result ==>> ', checkAuthResult)
            expect(checkAuthResult).toBe(true);
          })
        )
        .subscribe(() => done());

      const httpLoginRequest = httpMock.expectOne('http://127.0.0.1:4000/users/authenticate');
      httpLoginRequest.flush({
        jwtToken: 'the first accessToken',
        refreshToken: 'the first refreshToken'
      });
    }
  );
  afterEach(() => {
    httpMock.verify();
  });
})
