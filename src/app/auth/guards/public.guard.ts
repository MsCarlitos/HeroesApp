import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({ providedIn: 'root' })
export class PublicGuard {
  constructor(private route: Router, private authService: AuthService) { }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
      .pipe(
        tap( isAuthenticated => {
          if(isAuthenticated) this.route.navigate(['./'])
        }),
        map( isAuthenticated => !isAuthenticated)
      );
  }

  canMatchFn(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

  canActivateFn(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return this.checkAuthStatus();
  }

}

export const PublicGuardMatch: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | Observable<boolean> => {
  return inject(PublicGuard).canMatchFn(route, segments)
}
export const PublicGuardActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
  return inject(PublicGuard).canActivateFn(route, state)
}
