import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'angular-calendar';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { NormalComponent } from './normal/normal.component';
import { AdminComponent } from './admin/admin.component';
import { MeetingRouteGuardService } from './meeting-route-guard.service';
import { CalenderComponent } from './calender/calender.component';
import { MeetingManageComponent } from './meeting-manage/meeting-manage.component';

import { SocketService } from '../socket.service';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OwlDateTimeModule, 
    BrowserModule,
    BrowserAnimationsModule,
    OwlNativeDateTimeModule,
    CalendarModule.forRoot(),
    RouterModule.forChild([
      {path:'normal/dashboard',component:NormalComponent,canActivate:[MeetingRouteGuardService]},
      {path:'admin/dashboard' ,component: AdminComponent,canActivate:[MeetingRouteGuardService]},
      {path:'user/calender/:userId' ,component: CalenderComponent},
      {path:'meetingManage/:param' ,component: MeetingManageComponent},
      {path:'meetingManage/:param/:param2' ,component: MeetingManageComponent}

      
      
    ])
  ],
  declarations: [NormalComponent, AdminComponent, CalenderComponent, MeetingManageComponent],
  providers:[MeetingRouteGuardService,SocketService]
})
export class MeetingModule { }
