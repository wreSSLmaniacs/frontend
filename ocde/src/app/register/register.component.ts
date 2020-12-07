import { Component, OnInit } from '@angular/core';
import { NewUser } from './newuser'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { HttpResponse, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'

import { RegService } from '../reg.service'; 

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  mynewuser: NewUser;
  myfile : File = null;
  link:string="";
  visible = true;

  regForm = new FormGroup({
    username:new FormControl('', Validators.required),
    email: new FormControl('',Validators.required),
    password:new FormControl('',Validators.required),
    image:new FormControl('')
  })

  httpOptions = {
    headers: new HttpHeaders ({ 'Content-Type': 'application/json' })
  };

  constructor(private regserv:RegService,private _router:Router,private http:HttpClient) { }

  ngOnInit(): void {
  }

  public imagePath;
  imgURL: any;
  public message: string;

  onFileListener(event){
    this.myfile = event.target.files[0];
  }

  preview(files) {
    
    if (files.length === 0)
      return;
    
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 
    }
  };


  onUpload(){
    this.visible=false;
    const fd = new FormData();
    fd.append('image',this.myfile,this.myfile.name);

    this.http.post('http://127.0.0.1:8000/api/image',fd)
      .subscribe((res:any) => {
        console.log(res);
        this.link = res.url;
      });
  };

  onSubmit(){
    this.mynewuser={
      image: this.link,
      username: this.regForm.get('username').value,
      email: this.regForm.get('email').value,
      password: this.regForm.get('password').value,
      image: this.regForm.get('image').value
    }

    this.regserv.tryreg(this.mynewuser)
      .subscribe(
        res => {
          this._router.navigate(['/login'])
        },
        err => console.log(err)
      )
  }

}
