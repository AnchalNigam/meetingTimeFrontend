import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import {UserModule} from './user/user.module';
import {MeetingModule} from './meeting/meeting.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

import {MeetService}  from './meet.service';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { LoginComponent } from './user/login/login.component';
import {NotFoundComponent} from './not-found/not-found.component';
import {ServerErrorComponent} from './server-error/server-error.component';
import { SortPipe } from './sort.pipe';
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    ServerErrorComponent,
    SortPipe,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule, 
    ToastrModule.forRoot(),
    
    NgbModalModule.forRoot(),
    UserModule,
    MeetingModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      {path:'404',component:NotFoundComponent},
      {path:'500',component:ServerErrorComponent},
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '*', component: NotFoundComponent },
      { path: '**', component: NotFoundComponent },
      

    ])
  ],

  providers: [MeetService,SortPipe,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
