/// <reference path="util/auth.guard.ts" />

import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { AuthGuard } from './util/auth.guard';
import { HomeComponent } from './components/home/home.component'
const routes: Routes = [
    //{ path: '', redirectTo: 'home', pathMatch: 'full' },
    //{ path: 'Home', redirectTo: 'home' },
    { path: 'Home/SignIn', component: HomeComponent, canActivate: [AuthGuard] },
  
  // Lazy async modules
  //{
  //  path: 'login', loadChildren: './components/login.module#LoginModule'
  //},
  //{
  //  path: 'register', loadChildren: './+register/register.module#RegisterModule'
  //},
  //{
  //  path: 'profile', loadChildren: './+profile/profile.module#ProfileModule'
  //},
  //{
  //  path: 'admin', loadChildren: './+admin/admin.module#AdminModule'
  //},
  //{
  //  path: 'examples', loadChildren: './+examples/examples.module#ExamplesModule'
  //},
  {
      path: 'components', loadChildren: './components/components.module#ComponentsModule'
  }
 


];

export const routing = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });

