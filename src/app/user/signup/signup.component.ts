import { Component, OnInit } from '@angular/core';
import { MeetService } from './../../meet.service';
import { Router } from '@angular/router';
import { SortPipe } from '../../sort.pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName: string;
  public lastName: string;
  public userName:any;
  public mobile: number;
  public email: any;
  public password: any;
  public confirmPassword:any;
  public countryName:any="";
  public countryList:any;
  public finalCountryList:any=[];
  public codeList:any=[];
  public code:any;
  public userType:number=1;
  public userInfo:any;

  constructor(private meetService:MeetService,private router:Router,private sort:SortPipe,
    private spinnerService: NgxSpinnerService,private toastr: ToastrService) {
      
   }

  ngOnInit() {
    // console.log(Cookie.get('authtoken'))
    this.userInfo = this.meetService.getUserInfoFromLocalstorage();
    if(this.userInfo){
      
      if(this.userInfo.authToken === undefined || this.userInfo.authToken=== '' || this.userInfo.authToken === null){
        this.meetService.getCountryList().subscribe(
          Response=>{
             this.countryList=Response;
             for (var prop in this.countryList) {
              this.finalCountryList.push({
                'key': prop,
                'value': this.countryList[prop]
            });
    
             }
            this.finalCountryList=this.sort.transform(this.finalCountryList);
           
          }
        )
      
        
      }
      else{
        this.userInfo = this.meetService.getUserInfoFromLocalstorage();
        if(this.userInfo.userDetails.userType==1){
          this.router.navigate(['/normal/dashboard']);
          }
          else{
            this.router.navigate(['/admin/dashboard']);
          }
  
      }
      
    }
    else{
      this.meetService.getCountryList().subscribe(
        Response=>{
           this.countryList=Response;
           for (var prop in this.countryList) {
            this.finalCountryList.push({
              'key': prop,
              'value': this.countryList[prop]
          });
  
           }
          this.finalCountryList=this.sort.transform(this.finalCountryList);
         
        }
      )
    }
    
    
  }

  //method to detect change on select box to update code in mobile number input area
 public onChange=()=>{
   
  this.meetService.getCountryCode().subscribe(
    Response=>{
      this.codeList=Response;
     
      this.code=this.codeList[this.countryName];

    }
  )
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
//Method to signup
public signUpFunction=()=>{
  let data={
    "userType":this.userType,
    "firstName":this.firstName,
    "lastName":this.lastName,
    "userName":this.userName,
    "email":this.email,
    "password":this.password,
    "mobile":`+${this.code}-${this.mobile}`,
    "country":this.countryName     //here country code is sending
  }//end data
  
  
  this.spinnerService.show();

  this.meetService.signup(data).subscribe(
    Response=>{
     if (Response.status === 200) {
       this.spinnerService.hide();
       this.toastr.success('Signup Successful! Confirm your Email to proceed further.');
       setTimeout(() => {

         this.router.navigate(['/login']);

       }, 2000);
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
      },2000);
     }


    },
    error=>{
      setTimeout(()=>{
      this.spinnerService.hide();
     this.toastr.error('Server error occured');
      },2000);
    }

  )
 
}//end

}
