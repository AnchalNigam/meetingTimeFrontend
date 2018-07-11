import { Injectable } from '@angular/core';
import { CanActivate,ActivatedRouteSnapshot, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MeetService } from './../meet.service';
@Injectable({
  providedIn: 'root'
})
export class MeetingRouteGuardService {
   public userInfo:any;
  constructor(private router: Router, private meetService:MeetService) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {

    console.log("in guard service");
    this.userInfo = this.meetService.getUserInfoFromLocalstorage();
    console.log(this.userInfo);
    if(this.userInfo){
      if (this.userInfo.authToken === undefined || this.userInfo.authToken=== '' || this.userInfo.authToken === null) {

        this.router.navigate(['/']);
  
        return false;
  
      } else {
  
        return true;
  
      }
    }
    else{
      this.router.navigate(['/']);
      return false;
    }
    

  }
}
