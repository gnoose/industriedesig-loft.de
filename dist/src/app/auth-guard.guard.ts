import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PhpService } from './services/php.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private phpService: PhpService, private router: Router) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let response = await this.phpService.checkLoginSession();
    if (response['logged']) {
      return true;
    } else {
      console.log('access denied')
      this.router.navigate(['/login']);
    }
  }
}