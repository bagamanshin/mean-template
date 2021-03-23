import { Injectable } from "@angular/core";
import { AuthorizedUser, defaultRouteToRole, roles, User } from "../interfaces";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { catchError, delay, mapTo, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private accessToken: string | null = localStorage.getItem('accessToken') || null;
  private refreshToken: string | null = localStorage.getItem('refreshToken') || null;

  private userRole: BehaviorSubject<string> = new BehaviorSubject(localStorage.getItem('role') || roles.GUEST);

  constructor(private http: HttpClient, private router: Router) {}
  login(user: User): Observable<boolean> {
    return this.http.post<AuthorizedUser>(environment.apiUrl + '/users/authenticate', {
      username: user.email,
      password: user.password
    })
      .pipe(
        tap(
          // get id
          // we will get token in the future
          (res) => {
            const {jwtToken: accessToken, refreshToken} = res;

            this.userRole.next(roles.ADMIN);
            localStorage.setItem('role', this.userRole.getValue());

            // const refreshToken = String(Math.random()).slice(2);

            this.setAccessToken(accessToken);
            this.updateTokenInLocalStorage(accessToken, 'accessToken');

            this.setRefreshToken(refreshToken);
            this.updateTokenInLocalStorage(refreshToken, 'refreshToken');
          }
        ),
        mapTo(true),
        catchError(error => {
          console.log(error.error);
          return of(false);
        })
      );
  }
  register(user: User): Observable<boolean> {
    // should implement
    return of(true)
  }

  refreshTokens(): Observable<AuthorizedUser> {
    // remove current access token
    this.setAccessToken(null);
    this.updateTokenInLocalStorage(null, 'accessToken');

    return this.http
      .post<AuthorizedUser>(environment.apiUrl + '/users/refresh-token', {
        token: this.getRefreshToken()
      })
      .pipe(
        tap(
          (res: AuthorizedUser) => {
            const {jwtToken: accessToken, refreshToken} = res;

            this.setAccessToken(accessToken);
            this.updateTokenInLocalStorage(accessToken, 'accessToken');

            this.setRefreshToken(refreshToken);
            this.updateTokenInLocalStorage(refreshToken, 'refreshToken');
          }
        ),
        catchError(err => throwError(err))
      )
  }

  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }
  setRefreshToken(token: string | null): void {
    this.refreshToken = token;
  }


  updateTokenInLocalStorage(token: string | null, tokenType: string): void {
    if (token !== null) {
      localStorage.setItem(tokenType, token);
    } else {
      localStorage.removeItem(tokenType);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  getUserRole(): string {
    return this.userRole.getValue();
  }

  checkAuth(): Observable<boolean> {
    return this.http.get(environment.apiUrl + '/users').pipe(
      mapTo(true),
      catchError(err => {
        return of(false)
      })
    )
  }

  logout() {
    if (this.accessToken) {
      this.setAccessToken(null);
      this.updateTokenInLocalStorage(null, 'accessToken');
    }
    if (this.refreshToken) {
      this.setRefreshToken(null);
      this.updateTokenInLocalStorage(null, 'refreshToken');
    }
    localStorage.removeItem('role');

    this.userRole.next(roles.GUEST);
  }
}
