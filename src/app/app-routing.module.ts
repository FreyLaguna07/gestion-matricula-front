import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';

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
        path: 'nav/dashboard',
        component: DashboardComponent,
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
