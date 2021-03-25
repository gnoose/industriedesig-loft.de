import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';
import { AuthGuard } from './auth-guard.guard';

const routes: Routes = [
  { path: '', redirectTo: '/projects/Rectangle', pathMatch: 'full' },
  // { path: 'login', component: LoginPageComponent },
  // { path: 'register', component: RegisterPageComponent },
  { path: 'home', component: MenuComponent,/* canActivate: [AuthGuard] */},
  { path: 'projects/:name', component: MenuComponent, /* canActivate: [AuthGuard] */},
  { path: '**', redirectTo: '/home' },
  { path: 'projects/:**', redirectTo: '/home' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
