import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { EMPTY, Observable, Subject, throwError } from "rxjs";
import { catchError, switchMap, tap } from "rxjs/operators";

import { AuthService } from "../services/auth.service";

@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  private isRefreshingTokens: boolean = false;

  constructor(private auth: AuthService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle the request
    req = this.addAuthHeader(req);

    // call next() and handle the response
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          // we are unauthorized
          // OR
          // access token has been expired

          if (!this.isRefreshingTokens) {
            // try to refresh tokens
            return this.updateTokens().pipe(
              // switch to another stream
              switchMap(() => {
                console.log('%c%s', 'color: #0ebc00',
                  'Retrying to send main request with refreshed tokens...')
                // set a new accessToken at header
                req = this.addAuthHeader(req);
                return next.handle(req);
              })
            )
          } else {
            console.log('%c%s', 'color: darkred', 'The tokens are still refreshing, try later...');
            return throwError(error);
          }
        }

        return throwError(error);
      })
    )
  }

  private redirectToLoginPage() {
    this.router.navigate(['/login'], {
      queryParams: {
        sessionExpired: true,
        fromURL: this.router.url
      }
    })
  }

  private needAuthorize() {
    this.auth.logout();
    this.redirectToLoginPage();
  }

  private updateTokens() {
    this.isRefreshingTokens = true;
    // send a request to refresh tokens
    return this.auth
      .refreshTokens()
      .pipe(
        tap(() => {
          console.log('%c%s', 'color: blueviolet', 'Tokens have been refreshed!');
          this.isRefreshingTokens = false;
        }),
        catchError((error) => {
          this.isRefreshingTokens = false;
          console.log('%c%s', 'color: darkred', 'Fail to refresh tokens, redirecting to login page...');
          this.needAuthorize();
          return throwError(error);
        })
      )
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    // get the access token
    const token = this.auth.getAccessToken();

    if (token) {
      // append the access token to the request header
      return request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
    return request;
  }
}
