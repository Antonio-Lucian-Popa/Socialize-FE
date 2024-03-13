import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  constructor(
    private fb: UntypedFormBuilder,
  //  private authService: AuthService,
    private router: Router,
   // private alertService: AlertService
    ) { }

  ngOnInit(): void {
    // if(this.alertService.showAlertOnLoginSuccess) {
    //   this.alertService.showAlert('success', 'An error occurred!');
    //   this.alertService.showAlertOnLoginSuccess = false;
    // }
  }

  submit(): void {
    if(this.form.valid) {
      // this.authService.login(this.form.getRawValue()).subscribe(res => {
      //   this.authService.setAccessToken(res.access_token);
      //   this.router.navigate(['/']);
      // }, err => {
      //   // show alert error
      // });
    }
  }

  checkRequiredField(fieldName: string): boolean {
    return this.form.get(fieldName)!.invalid && (this.form.get(fieldName)!.dirty || this.form.get(fieldName)!.touched) && this.form.get(fieldName)!.hasError('required')
  }

}
