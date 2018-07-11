import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import * as _ from "lodash";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MeetService } from './../../meet.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from './../../socket.service';
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
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
  // providers:[SocketService]
 
})
export class CalenderComponent implements OnInit {

  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  @ViewChild('alertContent') alertContent: TemplateRef<any>;
  view: string = 'month';
  
  viewDate: Date = new Date();
  
  public authToken:any;
  public userName:String;
  public userId:any;
  public events:any=[];
 
  public dubEvents:any=[];
  public eventsList: any =[];
  public currentId:any="fg";
  private socket;
  private url = 'http://meetingapi.webdeveloperjourney.xyz';
  public userInfo:any;
  
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      cssClass:'text-success',
      
      onClick: ({ event }: { event}): void => {
        this.router.navigate(['/meetingManage','edit',event.meetingId]);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      cssClass:'text-success',
      onClick: ({ event }: { event }): void => {
        this.router.navigate(['/meetingManage','delete',event.meetingId]);
      }
    },
    
  ];

  refresh: Subject<any> = new Subject();

  activeDayIsOpen: boolean = false;

  constructor(private modal: NgbModal,private toastr: ToastrService,
    private meetService:MeetService,private router:Router,
    private SocketService: SocketService,private _route: ActivatedRoute,
    private cookieService: CookieService) {
      this.socket = io.connect(this.url,{ 'force new connection': true });
    
  } //constructr end

  ngOnInit() {
    this.userInfo=this.meetService.getUserInfoFromLocalstorage();
     this.authToken =  this.userInfo.authToken;
     this.userName= this.meetService.getSelectedUserNameFromLocalstorage();
     this.userId=this._route.snapshot.paramMap.get('userId');
     this.meetService.setSelectedUserIdInLocalStorage(this.userId);
     this.getMeetings();
     this.verifyUserConfirmation();
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
      && new Date(i.start).getTime()> currentTime && i.statusAdmin=="snooze"){
        if(this.currentId!=i.meetingId){
          
          this.modalData = { action:'clicked',event:i};
       this.modal.open(this.alertContent, { size: 'lg' });
       this.currentId=i.meetingId;
       break;
   }
    }
    
  }

}//end

//method to give alert via email
public meetingAlertByMail=()=>{
  let currentTime=new Date().getTime();
  for(let i of this.events){
    
    if(isSameDay(new Date(),i.start) && new Date(i.start).getTime()-currentTime<=900000
    && new Date(i.start).getTime()> currentTime && i.mailSentAdmin==0){
      i.user="admin";
      this.SocketService.remainderEvent(i,this.socket);
      this.SocketService.MailRemainderEventUpdate(i.meetingId,i.user,this.socket);
      i.mailSentAdmin=1;
  }
  
}

}//

//method to update meeting status to dismiss
public updateMeetingStatus=(meeting)=>{
  meeting.statusAdmin="dismiss";
  meeting.user="admin";
  this.SocketService.remainderEventUpdate(meeting.meetingId,meeting.user,this.socket);
   
}//end
  //method to get all meetings
  public getMeetings=()=>{
    this.meetService.getAllMeetings(this.userId,this.authToken).subscribe(
      Response=>{
        if(Response.status==200){
          this.eventsList=Response.data;
          this.dubEvents=this.eventsList;
         
          for(let i of this.dubEvents){
            i.start=new Date(i.start);
            i.end=new Date(i.end);
            i.actions=this.actions;
            let dayStart=i.start;
            let dayEnd=i.end;
            i.status="snooze";
            i.mailSent=0;
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
  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    
    
    if (isSameMonth(date, this.viewDate)) {
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

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(event)
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnDestroy(){
    this.socket.disconnect();
  }

}
