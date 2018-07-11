import { Component, OnInit } from '@angular/core';
import { MeetService } from './../../meet.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userType:number=1;
  public email:any;
  public password: any;
  public emailNeed: number = 1; //this is when user clicks on forgotpassword without giving email
  public userInfo:any;
  
  constructor(private meetService:MeetService,private router:Router,
    private spinnerService: NgxSpinnerService,private toastr: ToastrService,
    private cookieService: CookieService) {
      
   }

  ngOnInit() {
    if(!this.checkAuthStatus()){
      this.userInfo = this.meetService.getUserInfoFromLocalstorage();
      console.log(this.userInfo)
      if(this.userInfo){
        if(this.userInfo.userDetails.userType==1){
          this.router.navigate(['/normal/dashboard']);
          }
          else{
            this.router.navigate(['/admin/dashboard']);
          }
      }
      
    }
      
  }

  //method to check whether the authtoken is present or not,if no then only login page display
  public checkAuthStatus=():boolean=>{
    console.log('check status');
    this.userInfo = this.meetService.getUserInfoFromLocalstorage();
    if(this.userInfo){
      if(this.userInfo.authToken === undefined || this.userInfo.authToken === '' || this.userInfo.authToken  === null){
        
        return true;
      }
      else{
       
        return false;
      }
    }
    
   
  }//end

  //method to set the usertype as admin or normal
 public typeOfUser=(value:number)=>{
  this.userType=value;
}
//end

//method to validate username in case of admin
public userNameValid=(name:string):boolean=>{
   
  if(name.substr(name.length-6,name.length-1)!="-admin"){ //here 6 is of length of '-admin'
   
    return true;

  }
  else{
    
    return false;
  }

}
//end
 //method to login
 public logInFunction = (): any => {
  let data = {
    'userType':this.userType,
    'email': this.email,
    'password': this.password
  }
  
  this.spinnerService.show();
  this.meetService.logIn(data).subscribe(
    Response => {
      if (Response.status === 200) {
        // this.cookieService.set('authtoken', Response.data.authToken);
        
        // this.cookieService.set('receiverId', Response.data.userDetails.userId);

        // this.cookieService.set('receiverName', Response.data.userDetails.firstName + ' ' + Response.data.userDetails.lastName);
        
        // this.meetService.setUserInfoInLocalStorage(Response.data.userDetails)
        this.meetService.setUserInfoInLocalStorage(Response.data)
        
        setTimeout(()=>{
          this.spinnerService.hide();
          if(Response.data.userDetails.userType==1){
            this.router.navigate(['/normal/dashboard']);
          }
          else{
            this.router.navigate(['/admin/dashboard']);
          }
          
        },1000)
       

      }
      else if(Response.status==404){
        setTimeout(() => {
          this.spinnerService.hide();
          this.toastr.error(Response.message);

        },1000);
        
       
      }
      else if(Response.status==500){
        setTimeout(()=>{
          this.spinnerService.hide();
          this.router.navigate(['/500']);
        },1000)
        
      }
      else{
        setTimeout(()=>{
          this.spinnerService.hide();
          this.toastr.error(Response.message);
        },1000);
       
      }
     
    },
    (err) => {
      setTimeout(()=>{
        this.spinnerService.hide();
        this.toastr.error('Server Error Occured!');
      },1000)
     
     
    }
);
}//end

//method of forgot password
public forgotPassword = (email): any => {
  if (email == undefined) {
    this.emailNeed = 0;
  }
  else {
    console.log(email);
    this.spinnerService.show();
    this.meetService.forgotPassword(email).subscribe(
      Response => {
        if (Response.status === 200) {

          this.spinnerService.hide();
          this.toastr.success('Mail has been sent.Check for further process!');
          
          setTimeout(() => {

            this.router.navigate(['/login']);

          }, 2000);
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
          setTimeout(()=>{
          this.spinnerService.hide();
          this.toastr.error(Response.message);
          },2000);
        }

      },
      error => {
        setTimeout(()=>{
        this.spinnerService.hide();
        this.toastr.error(`Server Error Occured!`);
        },2000);

      });
  }
}//end 
}
