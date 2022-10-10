/*
    creating navigation in this file 
    also added lazy loading concept 
    below with loadchildren properties
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './common-components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/dashboard/home/home.component';


const routes: Routes = [
  // blank redirection
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // blank router redirected to dashboard
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },  // auth redirect..

  {
    path: '', component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard], },  // dashboard redirect..

    ]
  },



  // Wildcard route if url doesnt match with routes..
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
