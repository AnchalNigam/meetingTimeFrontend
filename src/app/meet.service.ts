import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { CookieService } from 'ngx-cookie-service';

import {HttpClient,HttpParams,HttpErrorResponse,HttpHeaders} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MeetService {
  public baseUrl="http://meetingapi.webdeveloperjourney.xyz/api/v1";
  
  constructor(private http: HttpClient,private cookieService: CookieService) { 
   
  }

  //Method to get country list
  public getCountryList=():Observable<any>=>{
   
    let response=this.http.get('../assets/countryList.json');
    return response;
  }//end

  //method to get country code
  public getCountryCode=():Observable<any>=>{
    let response=this.http.get('../assets/codeList.json');
    return response;
  }//end

  //method to signup 
  public signup=(data):Observable<any>=>{

    const params=new HttpParams()
      .set('userType', data.userType)
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('userName', data.userName)
      .set('email', data.email)
      .set('mobileNumber', data.mobile)
      .set('password', data.password)
      .set('country',data.country)
   return this.http.post(`${this.baseUrl}/users/signup`, params);

  }//end

  //Method to verify email
  public verifyEmail = (data): Observable<any> => {
    const param = new HttpParams()
      .set('hash', data)

    return this.http.put(`${this.baseUrl}/users/verifyEmail`, param);
  }
  //end method

  //method to login
  public logIn = (data): Observable<any> => {
    const param = new HttpParams()
      .set('userType', data.userType)
      .set('email', data.email)
      .set('password', data.password)

    return this.http.post(`${this.baseUrl}/users/login`, param);
  }//end

  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage

  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))


  }//end setuser

  public getSelectedUserNameFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('selectedUserName'));

  } // end getUserInfoFromLocalstorage


  public setSelectedUserNameInLocalStorage = (data) => {

    localStorage.setItem('selectedUserName', JSON.stringify(data))


  }//end setuser

  public getSelectedUserIdFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('selectedUserId'));

  } // end getUserInfoFromLocalstorage


  public setSelectedUserIdInLocalStorage = (data) => {

    localStorage.setItem('selectedUserId', JSON.stringify(data))


  }//end setuser

  //forgot password
  public forgotPassword = (email): Observable<any> => {
    const param = new HttpParams()
      .set('email', email)

    return this.http.post(`${this.baseUrl}/users/forgotPassword`, param);
  }//end

  //reset password function
  public resetPassword = (data): Observable<any> => {
    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)
    return this.http.put(`${this.baseUrl}/users/resetPassword`, params);


  }//end password function

  //method to get all users of system
  public getAllUsers=(authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/users/view/all/normal?authToken=${authToken}`);
  }//end

  //method to get all meetings
  public getAllMeetings=(userId,authToken):Observable<any>=>{
   
    return this.http.get(`${this.baseUrl}/meetings/${userId}/view/all?authToken=${authToken}`);

  }

  //method to get all admin meetings
  public getAllAdminMeetings=(adminId,authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/meetings/admin/${adminId}/view/all?authToken=${authToken}`);

  }

  //method to get a single meeting detail
  public getAMeetingDetail=(meetingId,authToken):Observable<any>=>{
    return this.http.get(`${this.baseUrl}/meetings/${meetingId}/view/single?authToken=${authToken}`);

  }//end

  public logout(authToken): Observable<any> {
    
    let data ={};
    return this.http.post(`${this.baseUrl}/users/logout?authToken=${authToken}`,data );
  
  } // end logout function
}
