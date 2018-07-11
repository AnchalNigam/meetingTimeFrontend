import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MeetService } from './../../meet.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public password:any;
  public confirmpassword:any;

  constructor(private meetService:MeetService,private router:Router,
    private spinnerService: NgxSpinnerService,private toastr: ToastrService,
    private _route: ActivatedRoute) { }

  ngOnInit() {

  }

  // //method to reset password
  public resetPassword = () => {
    let encodedEmail = this._route.snapshot.paramMap.get('id');
    let decodedEmail = atob(encodedEmail);
    let finalEmail = decodedEmail.substr(0, decodedEmail.length - 17); //here 17 is length of mmy seccretkey
   
      
      let data = {
        "email": finalEmail,
        "password": this.password
      }
      this.spinnerService.show();
      this.meetService.resetPassword(data).subscribe(
        Response => {
          if (Response.status === 200) {
            setTimeout(() => {
              this.spinnerService.hide();
              this.toastr.success(Response.message);
            },1000);
            
            setTimeout(() => {

              this.router.navigate(['/']);
  
            }, 1000);
          }
          else if(Response.status==404){
            setTimeout(() => {
              this.spinnerService.hide();
              this.router.navigate(['/404']);
  
            },1000);
           
          }
          else if(Response.status==500){
            setTimeout(()=>{
              this.spinnerService.hide();
              this.router.navigate(['/500']);
            },1000)
            
          }
          else {
            setTimeout(() => {
            this.spinnerService.hide();
            this.toastr.error(Response.message);
            },2000);
            
            
          }

        },
        error => {
          setTimeout(() => {
          this.spinnerService.hide();
          this.toastr.error(`Some Error Occured!`);
          },2000);

        });

  }//end reset password

}
