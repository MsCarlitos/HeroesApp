import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private route: Router, private authService: AuthService) { }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => {
          if(!isAuthenticated) this.route.navigate(['./auth/login'])
        })
      );
  }

  canMatchFn(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    // console.log('canMatch');
    // console.log({ route, segments });
    // return true;
    return this.checkAuthStatus();
  }

  canActivateFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // console.log('canActivate');
    // console.log({ route, state });
    // return true;
    return this.checkAuthStatus();
  }

}

export const AuthGuardMatch: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | Observable<boolean> => {
  return inject(AuthGuard).canMatchFn(route, segments)
}
export const AuthGuardActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
  return inject(AuthGuard).canActivateFn(route, state)
}
