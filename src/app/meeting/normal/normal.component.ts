import { Component, OnInit } from '@angular/core';
import { SocketService } from './../../socket.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MeetService } from './../../meet.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import * as io from 'socket.io-client';
import {
 
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
import { CalendarModule } from 'angular-calendar';


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
  selector: 'app-normal',
  templateUrl: './normal.component.html',
  styleUrls: ['./normal.component.css'],
  // providers:[SocketService]
})
export class NormalComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('alertContent') alertContent: TemplateRef<any>;
  
 

  view: string = 'month';
  
  viewDate: Date = new Date();

  public authToken:any;
  public receiverId:String;
  public receiverName:String;
  public userInfo:any;
  public events:any=[];
  public dubEvents:any=[];
  public eventsList: any =[];
  public currentId:any="fg";
  private socket;
  private url = 'http://meetingapi.webdeveloperjourney.xyz';
  
  modalData: {
    action: string;
    event: any;
  };

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal,private SocketService: SocketService,
    private meetService:MeetService,private toastr: ToastrService,
  private router:Router,private cookieService: CookieService) { 
    this.socket = io.connect(this.url,{ 'force new connection': true });
  }

  ngOnInit() {
    this.userInfo = this.meetService.getUserInfoFromLocalstorage();
   
    this.authToken = this.userInfo.authToken;
    this.receiverId = this.userInfo.userDetails.userId;
    this.receiverName =  `${this.userInfo.userDetails.firstName} ${this.userInfo.userDetails.lastName}`;
    
      
    this.getMeetingsFromDatabase();
    
    this.verifyUserConfirmation();
    this.getMeetings();

    setInterval(()=>{
       this.meetingAlert();
       this.meetingAlertByMail();
    },20000)
  }

  //methid for user verification (socket.io)
  public verifyUserConfirmation: any = () => {
    this.SocketService.verifyUser(this.socket).subscribe(
     (data) => {
       
       
       
       this.SocketService.setUser(this.authToken,this.socket);
       
      
     });
}//end

//method to give alert
public meetingAlert=()=>{
  let currentTime=new Date().getTime();
  
  for(let i of this.events){
    
      if(isSameDay(new Date(),i.start) && new Date(i.start).getTime()-currentTime<=300000
      && new Date(i.start).getTime()> currentTime && i.statusNormal=="snooze"){
        if(this.currentId!=i.meetingId){
          // if(i.meetingId=="HJg_IRiz7"){
          //   console.log('meeting')
            // if(this.currentId!=i.meetingId){
            this.modalData = { action:'clicked',event:i};
            this.modal.open(this.alertContent, { size: 'lg' });
            this.currentId=i.meetingId;
            break;
        //   }
        // }
   }
    }
    
  }

}//end

//method to give alert via email
public meetingAlertByMail=()=>{
  let currentTime=new Date().getTime();
  for(let i of this.events){
    
    if(isSameDay(new Date(),i.start) && new Date(i.start).getTime()-currentTime<=900000
    && new Date(i.start).getTime()> currentTime && i.mailSentNormal==0){
      i.user="normal";
      this.SocketService.remainderEvent(i,this.socket);
      this.SocketService.MailRemainderEventUpdate(i.meetingId,i.user,this.socket);
      i.mailSentNormal=1;
  }
  
}


}//end

//method to update meeting status to dismiss
public updateMeetingStatus=(meeting)=>{
  meeting.statusNormal="dismiss";
  meeting.user="normal";
  this.SocketService.remainderEventUpdate(meeting.meetingId,meeting.user,this.socket);
   
}//end

//method o get all meetings from database
public getMeetingsFromDatabase=()=>{
  console.log('called get')
  this.meetService.getAllMeetings(this.receiverId,this.authToken).subscribe(
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

dayClicked({ date, events }: { date: any; events: any[] }): void {
    
  if (isSameMonth(date, this.viewDate)) {
    console.log('yes same month')
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
      events.length === 0
    ) {
      this.activeDayIsOpen = false;
    } else {
      this.activeDayIsOpen = true;
      this.viewDate = date;
    }
  }
}

// eventTimesChanged({
//   event,
//   newStart,
//   newEnd
// }: CalendarEventTimesChangedEvent): void {
  
//   event.start = newStart;
//   event.end = newEnd;
//   this.handleEvent('Dropped or resized', event);
//   this.refresh.next();
// }

handleEvent(action: string, event: any): void {
  console.log(event)
  this.modalData = { event, action };
  this.modal.open(this.modalContent, { size: 'lg' });
}


//method to get meeting details
public getMeetings=()=>{
  this.SocketService.meetingInfo(this.receiverId,this.socket).subscribe(
    (data)=>{
      
      if(data.meetingDetails.operationName=="create"){
        this.setMeetingsInRealTimeCreate(data);
        this.toastr.success(`${data.meetingDetails.meetingCreatorName} created '${data.meetingDetails.title}' meeting!`);
      }
      else if(data.meetingDetails.operationName=="update"){
        this.setMeetingsInRealTimeEdit(data);
        
        this.toastr.success(`${data.meetingDetails.meetingCreatorName} updated '${data.meetingDetails.title}' meeting!`);
      }
      else if(data.operationName=="delete"){
        this.setMeetingsInRealTimeDelete(data);
        this.toastr.success(`${data.meetingCreatorName} deleted '${data.title}' meeting!`);
      }
      
    }
  )

}//end

//method to modify meetings array in realtime case
public setMeetingsInRealTimeCreate=(data)=>{
  for(let i of data.events){
    i.start=new Date(i.start);
    i.end=new Date(i.end);

  }
  this.events=data.events;
  
}//end

//method to set meetings details in real time for update opeartion
public setMeetingsInRealTimeEdit=(data)=>{
  console.log(data);
  for(let i of data.events){
    i.start=new Date(i.start);
    i.end=new Date(i.end);

  }
  this.events=data.events;
  
}//ends

///method to update events array in real time for delete opeartion
public setMeetingsInRealTimeDelete=(data)=>{
  this.events=this.events.filter((event)=>{
    return event.meetingId!=data.meetingId;
 
 });

}//end

//method to logout

  public logout=()=>{
  
    this.meetService.logout(this.authToken)
  .subscribe((apiResponse) => {
    if (apiResponse.status === 200) {
      console.log("logout called")
     
      this.cookieService.deleteAll();
    
      localStorage.clear();

      this.socket.disconnect();

      this.router.navigate(['/login']);

    } else {
      this.toastr.error(apiResponse.message)

    } // end condition

  }, 
  (err) => {
    this.toastr.error('Server error occured')

  });
   


  }//end

}

