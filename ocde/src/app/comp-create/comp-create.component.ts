import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { CompetitionService } from "../competition.service";

/**
 * This component is essentially a form. 
 * It lets you supply a problem and a testcase along with a schedule of your contest.
 * It uses Angular's NgxDateTimeModule and NgxMomentModule which uses Moment.js to accept Date and Time accurate to the minute.
 */

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
      outfile: [null],
      start: [''],
      end: [''],
    })
  }

  /**
   * A simple boolean function which keeps the Create button disabled till all the relevant information is provided
   */
  validate(): Boolean {
    if(this.form.get('title').value=='') return false;
    if(this.form.get('problem_st').value=='') return false;
    if(this.form.get('start').value=='') return false;
    if(this.form.get('end').value=='') return false;
    return true && this.inputReady && this.outputReady;
  }

  ngOnInit() { }

  /**
   * The following are standard function to store File type data in a form to facilitate easy upoads
   * In a request, the file is accesible via request.FILES['filename']
   */
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

  /**
   * The submitForm function is called when a user presses the Create button after providing the relevant information.
   * This button accumulates all the information into a FormData component and sends it to the server.
   * Alongside, it clears the form so that you can be ready to create another contest.
   * 
   * Note : Use the first 100 or so characters of your problem statement to generate interest. These are displayed when your problem is upcoming!
   */
  submitForm() {
    const formData = new FormData();
    formData.append('title',this.form.get('title').value);
    formData.append('problem_st',this.form.get('problem_st').value);
    formData.append('infile',this.form.get('infile').value);
    formData.append('outfile',this.form.get('outfile').value);
    formData.append('start',this.form.get('start').value.format());
    formData.append('end',this.form.get('end').value.format());
    this.cpservice.regContest(formData).subscribe(
      (response) => alert(response),
      (err) => console.log(console.error()
      )
    );
    this.form.setValue({
      title: [''],
      problem_st: [''],
      infile :[null],
      outfile: [null],
      start: [''],
      end: ['']
    });
    this.inbutton.nativeElement.value = null;
    this.outbutton.nativeElement.value = null;
  }

}