import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component'
import { BrowserModule } from '@angular/platform-browser';
import { AuthGuard } from './auth.guard';
import { EditorComponent } from './editor/editor.component';

const routes: Routes = [
  { path: 'login',component:LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: ProfileComponent,canActivate:[ AuthGuard ]},
  { path: 'editor', component: EditorComponent, canActivate:[ AuthGuard ]},
  { path: '**', redirectTo:'home',pathMatch:'full'}
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
