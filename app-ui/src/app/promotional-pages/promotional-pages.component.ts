import { Component, OnInit } from '@angular/core';
import { ApiService } from '../core/api.service';
import { Observable } from 'rxjs';
import { PromotionalPage } from '../types';
import { MatDialog } from '@angular/material/dialog';
import { TemplateDialogComponent } from './template-dialog/template-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-promotional-pages',
  templateUrl: './promotional-pages.component.html',
  styleUrls: ['./promotional-pages.component.scss'],
})
export class PromotionalPagesComponent implements OnInit {
  pages: Observable<{
    meta: {
      next_page: number | null;
      previous_page: number | null;
      count: number;
    };
    data: PromotionalPage[];
  }>;
  displayedColumns = ['image', 'title', 'description', 'actions'];

  constructor(private apiService: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.pages = this.apiService.getPromotionalPages(1);
  }

  createPage(page: PromotionalPage) {
    this.dialog.open(TemplateDialogComponent, {
      width: '800px',
      maxWidth: '80%',
      data: { slug: page.slug },
    });
  }
}
