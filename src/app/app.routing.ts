import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

// Guards
import { AuthGuard } from './auth.guard'
import { UserResolver } from './home-page/user.resolver';
// Components
import { LoginPageComponent } from './login-page/login-page.component'
import { SignupPageComponent } from './signup-page/signup-page.component'
import { HomePageComponent } from './home-page/home-page.component'
import { AdminPageComponent } from './admin-page/admin-page.component'

const appRoutes: Routes = [
  { path: '', component: LoginPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupPageComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomePageComponent, resolve: { data: UserResolver} },
  { path: 'admin', component: AdminPageComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes)
