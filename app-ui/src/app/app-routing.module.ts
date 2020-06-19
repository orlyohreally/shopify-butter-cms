import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigFormComponent } from './config/config-form/config-form.component';

const routes: Routes = [
  { path: 'config', component: ConfigFormComponent },
  {
    path: 'collections',
    loadChildren: () =>
      import('./collections/collections.module').then(
        (m) => m.CollectionsModule
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'config',
  },
  {
    path: 'collections',
    loadChildren: () =>
      import('./collections/collections.module').then(
        (m) => m.CollectionsModule
      ),
  },
  {
    path: 'promotional-pages',
    loadChildren: () =>
      import('./promotional-pages/promotional-pages.module').then(
        (m) => m.PromotionalPagesModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
