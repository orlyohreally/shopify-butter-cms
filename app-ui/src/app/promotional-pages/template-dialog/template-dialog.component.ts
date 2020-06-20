import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss'],
})
export class TemplateDialogComponent implements OnInit {
  form: FormGroup;
  hasExamples = false;
  exampleTemplate = `<h1>{{fields.twitter_card.title}}</h1>
<img style="max=width: 100%" src="{{fields.twitter_card.image}}"/>
<p>{{fields.twitter_card.Description}}</p>
<h2>{{fields.product_promo_banner.headline}}</h2>
<div style="display: flex; flex-wrap: wrap; justify-content: space-between">
{{#fields.product_promo_banner.product}}
  <div style="flex:1; padding: 10px">
    <a href="/collections/all/products/{{name}}">{{name}}</a>
    <img style="width: 100%" src="{{image}}"/>
    <p>{{description}}</p>
  </div>
{{/fields.product_promo_banner.product}}
</div>`;

  constructor(private dialogRef: MatDialogRef<TemplateDialogComponent>) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      template: new FormControl('', Validators.required),
    });
  }

  get template() {
    return this.form.get('template');
  }

  submitForm() {
    console.log(this.form.value, this.form.valid);
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value.template);
  }
}
