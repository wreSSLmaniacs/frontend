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

  in_tc = [];
  out_tc = [];

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

  ngOnInit() { 
    this.onTCUpdate();
  }

  onTCUpdate() {
    let n = this.form.get('N').value;
    this.tcarray = [...Array(n).keys()].map( i => i+1);
  }

  uploadInput(file) {
    this.in_tc.push(file.item(0));
  }

  uploadOutput(file) {
    this.out_tc.push(file.item(0));
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