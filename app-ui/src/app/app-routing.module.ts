import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigFormComponent } from './config/config-form/config-form.component';

const routes: Routes = [
  { path: 'config', component: ConfigFormComponent },
  {
    path: 'categories',
    loadChildren: () =>
      import('./categories/categories.module').then((m) => m.CategoriesModule),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'config',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
