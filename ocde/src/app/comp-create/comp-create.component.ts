import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { CompetitionService } from "../competition.service";

@Component({
  selector: 'app-comp-create',
  templateUrl: './comp-create.component.html',
  styleUrls: ['./comp-create.component.scss']
})

export class CompCreateComponent implements OnInit {
  @ViewChild('inAcceptor',{static: false}) inbutton : ElementRef;
  @ViewChild('outAcceptor',{static: false}) outbutton : ElementRef;

  form: FormGroup;

  inputReady : Boolean = false;
  outputReady : Boolean = false;

  constructor(
    public fb: FormBuilder,
    private cpservice: CompetitionService
    ) {
    this.form = this.fb.group({
      title: [''],
      problem_st: [''],
      infile :[null],
      outfile: [null]
    })
  }

  validate(): Boolean {
    if(this.form.get('title').value=='') return false;
    if(this.form.get('problem_st').value=='') return false;
    return true && this.inputReady && this.outputReady;
  }

  ngOnInit() { }

  uploadInput(files) {
    if(files.length>0) {
      const file = files.item(0);
      this.form.get('infile').setValue(file);
      this.inputReady = true;
    }
    else {
      this.inputReady = false;
    }
  }

  uploadOutput(files) {
    if(files.length>0) {
      const file = files.item(0);
      this.form.get('outfile').setValue(file);
      this.outputReady = true;
    }
    else {
      this.outputReady = false;
    }
  }

  submitForm() {
    const formData = new FormData();
    formData.append('title',this.form.get('title').value);
    formData.append('problem_st',this.form.get('problem_st').value);
    formData.append('infile',this.form.get('infile').value);
    formData.append('outfile',this.form.get('outfile').value);
    this.cpservice.regContest(formData).subscribe(
      (response) => alert(response),
      (err) => console.log(console.error()
      )
    );
    this.form.setValue({
      title: [''],
      problem_st: [''],
      infile :[null],
      outfile: [null]
    });
    this.inbutton.nativeElement.value = null;
    this.outbutton.nativeElement.value = null;
  }
}