import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';

const routes: Routes = [

  {
    path: '',
    component: NavComponent,
    children: [
      {
        path: 'nav',
        loadChildren: () => import('./nav/nav.module').then((m) => m.NavModule),
      },

      {
				path: 'alumno',
				loadChildren: () => import('./modules/gestion/alumno/alumno.module').then(m => m.AlumnoModule)
			},


      /*{
        path: 'dashboard',
        component: DashboardComponent,
      },*/
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
