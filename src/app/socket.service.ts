import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  // private url = 'http://localhost:3005';
  
  constructor(private http: HttpClient) { 
    // this.socket = io.connect(this.url,{ 'force new connection': true });
  }

  //method to listen to verify user event
  public verifyUser = (socket) => {
    return Observable.create((observer) => {
      socket.on('verifyUser', (data) => {
        observer.next(data);
      }); //end socket
    });//end observable

  }//end verify user event

  //emit event
public setUser=(sendData,socket)=>{
   socket.emit('setUser',sendData);
}//end of this event

//method to listen online user list
public onlineUserList = (socket) => {

  return Observable.create((observer) => {

     socket.on("online-user-list", (userList) => {

      observer.next(userList);

    }); // end Socket

  }); // end Observable

} // end onlineUserList

//method to create meeting
public createMeeting = (meetingDetails,events,socket) => {
  let data={
    meetingDetails:meetingDetails,
    events:events
  }

   socket.emit('create-meeting', data);

} // end 

public meetingInfo = (userId,socket) => {

  return Observable.create((observer) => {
    
     socket.on(userId, (data) => {

      observer.next(data);

    }); // end Socket

  }); // end Observable

} // end 

//method to update meeting
public updateMeeting = (meetingDetails,events,socket) => {
    let data={
      meetingDetails:meetingDetails,
      events:events
    }
  //  socket.emit('update-meeting', meetingDetails);
   socket.emit('update-meeting', data);

} // end 

//method to delete meeting
public deleteMeeting = (meetingDetails,socket)=> {

   socket.emit('delete-meeting', meetingDetails);

} // end 

//method to remind about meeting via email
public remainderEvent = (meetingDetails,socket) => {
 
    socket.emit('remind-event', meetingDetails);

} // end 

//method to update meeting sattus to dismiss on remind 
public remainderEventUpdate = (meetingId,user,socket) => {
  let meetingDetails={
    "meetingId":meetingId,
    "user":user
  }
   socket.emit('remind-event-update', meetingDetails);

} // end 

//method to update meeting mail sent to 1 on remind 
public MailRemainderEventUpdate = (meetingId,user,socket) => {
  let meetingDetails={
    "meetingId":meetingId,
    "user":user
  }
 
   socket.emit('mail-remind-event-update', meetingDetails);

} // end 

public exitSocket = (socket) : any =>{
  
   socket.emit('disconnection');


}// end exit socket

}
