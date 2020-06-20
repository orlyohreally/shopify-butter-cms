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

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.pages = this.apiService.getPromotionalPages(1);
  }

  createPage(page: PromotionalPage) {
    const dialogRef = this.dialog.open(TemplateDialogComponent, {
      width: '800px',
      maxWidth: '80%',
    });
    dialogRef.afterClosed().subscribe((template) => {
      if (!template) {
        return;
      }
      console.log(page);
      this.apiService
        .createPageFromButterCMSPage(page.slug, template)
        .subscribe(
          (res) => {
            this.snackBar.open(
              'Page was successfully created. Check your shop pages.',
              null,
              { duration: 3000, panelClass: 'notification_success' }
            );
            console.log(res);
          },
          (error) => {
            console.log(error);
            this.snackBar.open(
              'Error occurred during page creation. Check your template',
              null,
              { duration: 3000, panelClass: 'notification_error' }
            );
          }
        );
    });
  }
}
