import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';

import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { InnerPageComponent } from './inner-page/inner-page.component';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';

import { AuthGuard } from './shared/guards/auth.guard';
import { Guard404 } from './shared/guards/404.guard';
import { roles } from './shared/interfaces';

const routes: Routes = [
  {
    path: '', component: SiteLayoutComponent, children: [
      {
        path: 'login',
        component: LoginPageComponent,
        canActivate: [AuthGuard],
        data: { roles: [roles.GUEST] }
      },
      {
        path: 'registration',
        component: RegisterPageComponent,
        canActivate: [AuthGuard],
        data: { roles: [roles.GUEST] }
      },
      {
        path: 'inner',
        component: InnerPageComponent,
        canActivate: [AuthGuard],
        data: { roles: [roles.AUTH_USER, roles.ADMIN] }
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: [roles.ADMIN] },
    children: [
      {
        path: 'statistics',
        component: AdminStatisticsComponent,
        data: { roles: [roles.ADMIN] }
      }
    ]
  },
  // otherwise redirect to default route
  { path: '**', canActivate: [Guard404], children: [] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
