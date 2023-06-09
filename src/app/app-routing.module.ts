import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { LoginComponent } from './shared/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  {
    path: 'nav',
    component: NavComponent,
    children: [
      {
        path: 'nav',
        loadChildren: () => import('./nav/nav.module').then((m) => m.NavModule),
      },
      {
        path: 'alumno',
        loadChildren: () =>
          import('./modules/gestion/alumno/alumno.module').then(
            (m) => m.AlumnoModule
          ),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
