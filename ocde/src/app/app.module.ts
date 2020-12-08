import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { RegService } from './reg.service';
import { LoginService } from './login.service';
import { AuthGuard } from './auth.guard';
import { EditorComponent } from './editor/editor.component';
import { EditorDialogComponent } from './editor-dialog/editor-dialog.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { CompDashboardComponent } from './comp-dashboard/comp-dashboard.component';
import { CompCreateComponent } from './comp-create/comp-create.component';
import { CompetitionComponent } from './competition/competition.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from "@angular-material-components/moment-adapter";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { TimerComponent } from './timer/timer.component';
import { PastcontestComponent } from './pastcontest/pastcontest.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    HomeComponent,
    EditorComponent,
    EditorDialogComponent,
    CompDashboardComponent,
    CompCreateComponent,
    CompetitionComponent,
    TimerComponent,
    PastcontestComponent,
    LoadingComponent
  ],
  entryComponents: [EditorDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatDatepickerModule
  ],
  providers: [RegService,LoginService,AuthGuard,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
