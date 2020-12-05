import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-comp-create',
  templateUrl: './comp-create.component.html',
  styleUrls: ['./comp-create.component.scss']
})

export class CompCreateComponent implements OnInit {
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    private http : HttpClient
    ) {
    this.form = this.fb.group({
      problem_st: [''],
      input_tc: [null],
      output_tc: [null]
    })
  }

  ngOnInit() { }

  uploadInput(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      input_tc: file
    });
    this.form.get('input_tc').updateValueAndValidity()
  }

  uploadOutput(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      output_tc: file
    });
    this.form.get('output_tc').updateValueAndValidity()
  }

  submitForm() {
    var formData: any = new FormData();
    formData.append("problem_st", this.form.get('problem_st').value);
    formData.append("input_tc", this.form.get('input_tc').value);
    formData.append("output_tc", this.form.get('output_tc').value);
    this.http.post('http://localhost:4000/api/create-user', formData).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )
  }
}
