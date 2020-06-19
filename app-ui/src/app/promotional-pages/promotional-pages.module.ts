import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromotionalPagesRoutingModule } from './promotional-pages-routing.module';
import { PromotionalPagesComponent } from './promotional-pages.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [PromotionalPagesComponent],
  imports: [
    CommonModule,
    PromotionalPagesRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
})
export class PromotionalPagesModule {}
