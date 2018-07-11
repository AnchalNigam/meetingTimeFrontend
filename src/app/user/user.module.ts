import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// imprt components
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent},
      {path:'verify/:hash' ,component: VerifyEmailComponent},
      {path:'reset/:id',component:ResetPasswordComponent},
      
    ])
  ],

  declarations: [SignupComponent, LoginComponent, VerifyEmailComponent, ResetPasswordComponent]
})
export class UserModule { }
