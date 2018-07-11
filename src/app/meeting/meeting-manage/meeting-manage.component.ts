import { Component, OnInit } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import * as shortid from 'shortid';
import { SocketService } from './../../socket.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { MeetService } from './../../meet.service';
import * as io from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';
import {
  
  isSameDay,
  
} from 'date-fns';
const colors: any = [
  
  {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
   
   {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  {
    primary: '#FFC0CB',
    secondary: '#FFC0CB'
  },
  {
    primary: '#000000',
    secondary: '#000000'
  },
  {
    primary: '#9370DB',
    secondary: '#9370DB'
  },
  {
    primary: '#8B0000',
    secondary: '#8B0000'
  },
  {
    primary: '#ADFF2F',
    secondary: '#ADFF2F'
  },
  {
    primary: '#20B2AA',
    secondary: '#20B2AA'
  },
  {
    primary: '#5F9EA0',
    secondary: '#5F9EA0'
  },
  {
    primary: '#DEB887',
    secondary: '#DEB887'
  },


];

@Component({
  selector: 'app-meeting-manage',
  templateUrl: './meeting-manage.component.html',
  styleUrls: ['./meeting-manage.component.css'],
  // providers:[SocketService]
  
})
export class MeetingManageComponent implements OnInit {
  public authToken:any;
  public receiverId:String;
  public meetingCreatorName:String;
  public meetingCreatorId:String;
  public meetingTitle:String;
  public start:any;
  public end:any;
  public venueName:any;
  public meetingPurpose:String;
  public meetingPartner:String;
  public meetingPartnerId:String;
  public param:String;
  public param2:String;
  public createPartActive:boolean=false;
  public editPartActive:boolean=false;
  public deletePartActive:boolean=false;
  public events:any=[];
  public dubEvents:any=[];
  public eventsList: any =[];
  private socket;

  private url = 'http://meetingapi.webdeveloperjourney.xyz';
  public userInfo:any;
  
  constructor(private SocketService: SocketService,private toastr: ToastrService,
    private router:Router,private _route: ActivatedRoute,
    private meetService:MeetService,
    private cookieService: CookieService) {
      this.socket = io.connect(this.url,{ 'force new connection': true });
     }

  ngOnInit() {
    this.userInfo=this.meetService.getUserInfoFromLocalstorage();
    this.authToken = this.userInfo.authToken;
    this.receiverId = this.userInfo.userDetails.userId;
    this.meetingCreatorName =  `${this.userInfo.userDetails.firstName} ${this.userInfo.userDetails.lastName}`;
    this.meetingCreatorId =  this.userInfo.userDetails.userId;

    this.meetingPartner=this.meetService.getSelectedUserNameFromLocalstorage();
    this.meetingPartnerId=this.meetService.getSelectedUserIdFromLocalstorage();
    this.param=this._route.snapshot.paramMap.get('param');
    this.verifyUserConfirmation();
    
    if(this.param=="create"){
      this.createPartActive=true;
    }
    else if(this.param=="edit"){
      this.editPartActive=true;
      this.param2=this._route.snapshot.paramMap.get('param2');
      this.getAMeeting();
    }
    else{
      this.deletePartActive=true;
      this.param2=this._route.snapshot.paramMap.get('param2');
      this.getAMeeting();
    }
    this.getMeetingsFromDatabase();

  }

  //methid for user verification (socket.io)
  public verifyUserConfirmation: any = () => {
    this.SocketService.verifyUser(this.socket).subscribe(
     (data) => {
       
       
       this.SocketService.setUser(this.authToken,this.socket);
       
      
     });
}//end

//mmethod to check whhther the start date is earlier than end date
public checkDate=(start,end)=>{
  
let startDate=new Date(start).getTime();
let endDate=new Date(end).getTime();

  if(startDate>=endDate){
    
    return true;
    
  }
  else{
    
    return false;
  }

 
}//end

//method o get all meetings from database
public getMeetingsFromDatabase=()=>{
  console.log('called get')
  this.meetService.getAllMeetings( this.meetingPartnerId,this.authToken).subscribe(
    Response=>{
      if(Response.status==200){
        this.eventsList=Response.data;
        this.dubEvents=this.eventsList;
       
        for(let i of this.dubEvents){
          i.start=new Date(i.start);
          i.end=new Date(i.end);
          
          let dayStart=i.start;
          let dayEnd=i.end;
          
          let index;
          index=0;
          this.dubEvents.map((event)=>{
                   
                  if(isSameDay(dayStart,new Date(event.start)) || isSameDay(dayEnd,
                    new Date(event.start)) 
                  || isSameDay(dayStart,new Date(event.end)) || isSameDay(dayEnd,
                    new Date(event.end))
                  || (new Date(event.start).getTime()>dayStart.getTime() && 
                  new Date(event.start).getTime()<dayEnd.getTime())){
                    
                    event.color=colors[index];
                    
                    
                  }
                  index=index+1;
              });
              
        }
        
        this.events=this.dubEvents;
        console.log(this.events)
       
      }
      else{
        this.toastr.error(Response.message);
      }


    },
    error=>{
      this.toastr.error('Server Error Occured');
      this.router.navigate(['/505']);
    }



  )

}//end
//method to save metting details
public saveMeeting=()=>{
  if(this.param=="create"){
    let meetingDetails={
      "meetingId":shortid.generate(),
      "meetingCreatorId":this.meetingCreatorId,
      "meetingCreatorName":this.meetingCreatorName,
      "title":this.meetingTitle,
      "start":new Date(this.start),
      "end":new Date(this.end),
      "venueName":this.venueName,
      "meetingPurpose":this.meetingPurpose,
      "meetingPartnerId": this.meetingPartnerId,
      "meetingPartner":this.meetingPartner,
      "createdOn":new Date(),
      "modifiedOn":new Date()
  
    }//end meetingdetails
    console.log(meetingDetails);
    this.events=this.setMeetings(meetingDetails);

    this.SocketService.createMeeting(meetingDetails,this.events,this.socket);
    this.toastr.success(`You have successfully created '${this.meetingTitle}' meeting!`)
    setTimeout(()=>{
       this.router.navigate(['/user/calender',this.meetingPartnerId])
    },2000);
  }
  else if(this.param=="edit"){
    let meetingDetails={
      "meetingId":this.param2,
      "meetingCreatorId":this.meetingCreatorId,
      "meetingCreatorName":this.meetingCreatorName,
      "title":this.meetingTitle,
      "start":new Date(this.start),
      "end":new Date(this.end),
      "venueName":this.venueName,
      "meetingPurpose":this.meetingPurpose,
      "meetingPartnerId": this.meetingPartnerId,
      "meetingPartner":this.meetingPartner,

    }
    console.log(meetingDetails);
    //updating my events list so that can send to concerned user
    this.events.map((event)=>{
      if(event.meetingId==meetingDetails.meetingId){
        event.title=meetingDetails.title;
        event.start=new Date(meetingDetails.start);
        event.end=new Date(meetingDetails.end);
        event.venueName=meetingDetails.venueName;
        event.meetingPurpose=meetingDetails.meetingPurpose;
        
      }
  
    });
    this.SocketService.updateMeeting(meetingDetails,this.events,this.socket);
    this.toastr.success(`You have successfully updated '${this.meetingTitle}' meeting!`)
    setTimeout(()=>{
       this.router.navigate(['/user/calender',this.meetingPartnerId])
    },2000);
  }
  

  

}//end

//method to update events list to send to concerned user
public setMeetings=(data):any=>{
  data.statusNormal="snooze";
  data.mailSentNormal=0;
  this.events.unshift(data);
  console.log(this.events);
  this.dubEvents=this.events;
  
  for(let i of this.dubEvents){
    i.start=new Date(i.start);
    i.end=new Date(i.end);
    
    let dayStart=i.start;
    let dayEnd=i.end;
    
    let index;
    index=0;
    this.dubEvents.map((event)=>{
             
            if(isSameDay(dayStart,new Date(event.start)) || isSameDay(dayEnd,
              new Date(event.start)) 
            || isSameDay(dayStart,new Date(event.end)) || isSameDay(dayEnd,
              new Date(event.end))
            || (new Date(event.start).getTime()>dayStart.getTime() && 
            new Date(event.start).getTime()<dayEnd.getTime())){
              
              event.color=colors[index];
              
              
            }
            index=index+1;
        });
        
  }
  
  this.events=this.dubEvents;
  return this.events;

}

//method to get a meeting details to display in a form for editing,delete action
public getAMeeting=()=>{
  this.meetService.getAMeetingDetail(this.param2,this.authToken).subscribe(
    Response=>{
      if(Response.status==200){
         this.meetingCreatorName=Response.data.meetingCreatorName;
         this.meetingTitle=Response.data.title;
         this.start=Response.data.start;
         this.end=Response.data.end;
         this.meetingPurpose=Response.data.meetingPurpose;
         this.venueName=Response.data.venueName;

      }
      else{
        this.toastr.error(Response.message);
        setTimeout(()=>{
           this.router.navigate(['/user/calender',this.meetingPartnerId]);
        },1000);
        
      }

    },
    error=>{
      this.toastr.error('Server Error Occured');
      this.router.navigate(['/505']);
    }
  )

}//end

//method to go to calendar page
public goToCalendar=()=>{
  
  this.router.navigate(['/user/calender',this.meetingPartnerId]);

}//end

//method to delete meeting
public deleteMeeting=()=>{
  let meetingDetails={
      "meetingId":this.param2,
      "meetingCreatorId":this.meetingCreatorId,
      "meetingCreatorName":this.meetingCreatorName,
      "title":this.meetingTitle,
      "meetingPartnerId": this.meetingPartnerId,
      "meetingPartner":this.meetingPartner,


  }
    this.SocketService.deleteMeeting(meetingDetails,this.socket);
    this.toastr.success(`You have successfully deleted '${this.meetingTitle}' meeting!`)
    setTimeout(()=>{
       this.router.navigate(['/user/calender',this.meetingPartnerId])
    },2000);

}//end

ngOnDestroy(){
  this.socket.disconnect();
}
}
