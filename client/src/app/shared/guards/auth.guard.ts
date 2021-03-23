import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from "@angular/router";
import { defaultRouteToRole, roles } from "../interfaces";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService,
              private router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const permittedRoles = route.data?.roles || [];
    if (permittedRoles.includes(this.auth.getUserRole())) {
      return true
    } else {
      if (this.auth.getUserRole() === roles.GUEST) {
        this.router.navigate(['/login'], {
          queryParams: {
            accessDenied: true,
            fromURL: state.url
          }
        });
      } else {
        this.router.navigate([defaultRouteToRole[this.auth.getUserRole()]])
      }
      return false
    }
  }
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state)
  }
}
