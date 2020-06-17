import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/core/api.service';

@Component({
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.scss'],
})
export class ConfigFormComponent implements OnInit {
  form: FormGroup;
  submittingForm = false;
  errorMessage: string;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      // FIXME: not commit with 'a'.repeat(40)
      butterCMSWriteToken: new FormControl('a'.repeat(40), [
        Validators.required,
        Validators.minLength(40),
        Validators.maxLength(40),
      ]),
    });
  }

  get butterCMSWriteToken() {
    return this.form.get('butterCMSWriteToken');
  }

  submitForm() {
    console.log(this.form.value, this.form.valid);
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.submittingForm = true;
    this.apiService.configApp(this.form.value).subscribe(
      () => {
        console.log('yey');
        this.submittingForm = false;
      },
      (error) => {
        console.log(error);
        this.submittingForm = false;
        this.errorMessage = 'Server error';
      }
    );
  }
}
