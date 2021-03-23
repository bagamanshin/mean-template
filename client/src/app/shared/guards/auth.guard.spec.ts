import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { AuthorizedUser, defaultRouteToRole, roles } from '../interfaces';

class MockRouter {
    navigate(path) { }
}

class MockActivatedRouteSnapshot {
    private _data: any;
    get data() {
        return {
          roles: [roles.AUTH_USER]
        };
    }
}

class MockRouterStateSnapshot {
    url: string = '/';
}

let currentRole: string;

class MockAuthService {
    getUserRole(): string {
        return currentRole;
    };
}

describe('AuthGuard', () => {
    describe('canActivate & canActivateChild', () => {
        let authGuard: AuthGuard;
        let authService: AuthService;
        let router: Router;
        let route: ActivatedRouteSnapshot;
        let state: RouterStateSnapshot;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [AuthGuard,
                    { provide: Router, useClass: MockRouter },
                    { provide: ActivatedRouteSnapshot, useClass: MockActivatedRouteSnapshot },
                    { provide: AuthService, useClass: MockAuthService },
                    { provide: RouterStateSnapshot, useClass: MockRouterStateSnapshot }
                ]
            });
            router = TestBed.inject(Router);
            spyOn(router, 'navigate');
            authService = TestBed.inject(AuthService);
            authGuard = TestBed.inject(AuthGuard);
            state = TestBed.inject(RouterStateSnapshot);
        });

        it('Administrator can access to any admin routes when logged in', () => {
            setCurrentRole(roles.ADMIN);
            setAllowedRoles([roles.ADMIN]);

            expect(authGuard.canActivate(route, state)).toEqual(true);
            expect(authGuard.canActivateChild(route, state)).toEqual(true);
        });

        it('Simple auth user cannot access to any admin routes when logged in', () => {

            setCurrentRole(roles.AUTH_USER);
            setAllowedRoles([roles.ADMIN]);

            expect(authGuard.canActivate(route, state)).toEqual(false);
            expect(authGuard.canActivateChild(route, state)).toEqual(false);
            expect(router.navigate).toHaveBeenCalledWith([defaultRouteToRole[authService.getUserRole()]]);
        });

        it('Redirect to default route when any roles aren\'t setted as allowed', () => {
            setCurrentRole(roles.ADMIN);
            setAllowedRoles([]);

            expect(authGuard.canActivate(route, state)).toEqual(false);
            expect(authGuard.canActivateChild(route, state)).toEqual(false);
            expect(router.navigate).toHaveBeenCalledWith([defaultRouteToRole[authService.getUserRole()]]);
        });

        it('Redirect to login when user is not logged in', () => {

            setCurrentRole(roles.GUEST);
            setAllowedRoles([roles.ADMIN]);

            expect(authGuard.canActivate(route, state)).toEqual(false);
            expect(authGuard.canActivateChild(route, state)).toEqual(false);
            //redirect to login page with redirect URL
            expect(router.navigate).toHaveBeenCalledWith(
              ['/login'],
              Object({
                  queryParams: Object({
                      accessDenied: true,
                      fromURL: state.url
                    })
                })
            );
        });
        function setCurrentRole(role: string) {
          currentRole = role;
        }
        function setAllowedRoles(allowedRoles: string[]) {
            route = TestBed.inject(ActivatedRouteSnapshot);
            spyOnProperty(route, 'data', 'get').and.returnValue(allowedRoles.length ? { roles: allowedRoles } : undefined);
        }
    });

});
