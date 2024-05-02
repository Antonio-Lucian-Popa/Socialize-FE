import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { WelcomeComponent } from './features/welcome/welcome.component';

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  // ... other options ...
};

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
  { path: 'user-profile/:id', loadChildren: () => import('./features/user-profile/user-profile.module').then(m => m.UserProfileModule), canActivate: [AuthGuard]  },
  { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard]  },
  { path: 'discovery', loadChildren: () => import('./features/discovery/discovery.module').then(m => m.DiscoveryModule), canActivate: [AuthGuard]  },
  { path: 'log-in', loadChildren: () => import('./auth/components/log-in/log-in.module').then(m => m.LogInModule) },
  { path: 'sign-up', loadChildren: () => import('./auth/components/register/register.module').then(m => m.RegisterModule) },
  { path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},
  // { path: 'forgot-password', loadChildren: () => import('./auth/components/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule) },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerOptions)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
