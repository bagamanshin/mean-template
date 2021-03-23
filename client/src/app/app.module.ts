import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { TogglePasswordDirective } from './shared/directives/toggle-password.directive';
import { TokenInterceptor } from './shared/interceptors/token.interceptor';
import { AdminLayoutComponent } from './shared/layouts/admin-layout/admin-layout.component';
import { AdminStatisticsComponent } from './admin-statistics/admin-statistics.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    TogglePasswordDirective,
    AdminLayoutComponent,
    AdminStatisticsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
