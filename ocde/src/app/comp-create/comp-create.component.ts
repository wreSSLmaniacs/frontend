import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { CompetitionService } from "../competition.service";

@Component({
  selector: 'app-comp-create',
  templateUrl: './comp-create.component.html',
  styleUrls: ['./comp-create.component.scss']
})

export class CompCreateComponent implements OnInit {
  
  form: FormGroup;

  tcarray = [];

  in_tc: File[] = [];
  out_tc: File[] = [];

  constructor(
    public fb: FormBuilder,
    private cpservice: CompetitionService
    ) {
    this.form = this.fb.group({
      title: [''],
      problem_st: [''],
      N: 1
    })
  }

  validate(): Boolean {
    if(this.form.get('title').value=='') return false;
    if(this.form.get('problem_st').value=='') return false;
    if(this.in_tc.includes(null)) return false;
    if(this.out_tc.includes(null)) return false;
    return true;
  }

  ngOnInit() { 
    this.onTCUpdate();
  }

  resize(arr: File[],n: number) {
    while(arr.length<n) {
      arr.push(null);
    }
    while(arr.length>n) {
      arr.pop();
    }
  }

  onTCUpdate() {
    let n = this.form.get('N').value;
    this.tcarray = [...Array(n).keys()].map( i => i+1);
    this.resize(this.in_tc,n);
    this.resize(this.out_tc,n);
  }

  uploadInput(file,index) {
    this.in_tc[index-1] = file.item(0);
  }

  uploadOutput(file,index) {
    this.out_tc[index-1] = file.item(0);
  }

  submitForm() {
    this.cpservice.regContest({
      "title" : this.form.get('title').value,
      "problem_st" : this.form.get('problem_st').value,
      "in_tc" : this.in_tc,
      "out_tc" : this.out_tc
    }).subscribe(
      response => alert(response)
    )
  }
}