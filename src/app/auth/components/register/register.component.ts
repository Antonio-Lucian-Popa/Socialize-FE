import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CreateUser } from '../../interfaces/createUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    birthday: ['', Validators.required],
    gender: ['Gender']
  });

  constructor
    (private fb: UntypedFormBuilder,
      private authService: AuthService,
      private router: Router
    ) { }

  ngOnInit(): void {
  }

  submit(): void {
    if (this.form.valid) {
      const form = this.form.getRawValue();
      const payload: CreateUser = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        birthday: form.birthday,
        gender: (form.gender !== "Gender") ? form.gender : 'NO_SPECIFIED'
      }

      this.authService.register(payload).subscribe(res => {
        this.router.navigate(['/log-in']);
      }, err => {
        console.log(err);
      });
      //   this.alertService.showAlertOnLoginSuccess = true;
      //   this.router.navigate(['/login']);
      //   console.log(res)
      // }, err => {
      //   // TODO: show alert error
      //   this.alertService.showAlert('error', err.error.message);
      //   this.alertService.showAlertOnLoginSuccess = false;
      // });
    }
  }

  checkRequiredField(fieldName: string): boolean {
    return this.form.get(fieldName)!.invalid && (this.form.get(fieldName)!.dirty || this.form.get(fieldName)!.touched) && this.form.get(fieldName)!.hasError('required')
  }

}
