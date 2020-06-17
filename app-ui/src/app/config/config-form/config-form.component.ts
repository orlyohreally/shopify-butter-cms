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
  tokenLength = 40;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      butterCMSWriteToken: new FormControl('', [
        Validators.required,
        Validators.minLength(this.tokenLength),
        Validators.maxLength(this.tokenLength),
      ]),
    });
  }

  get butterCMSWriteToken() {
    return this.form.get('butterCMSWriteToken');
  }

  submitForm() {
    if (!this.form.valid) {
      this.form.markAsTouched();
      return;
    }
    this.submittingForm = true;
    this.errorMessage = '';
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
