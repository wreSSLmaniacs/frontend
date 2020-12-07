import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { LoginService } from "../login.service";

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-r';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

import { CompetitionService } from '../competition.service';

@Component({
  selector: 'app-competition',
  templateUrl: './competition.component.html',
  styleUrls: ['./competition.component.scss']
})

export class CompetitionComponent implements AfterViewInit {
  @ViewChild('codeEditor') private editor: ElementRef<HTMLElement>;

  private aceEditor: ace.Ace.Editor;
  private editorBeautify;

  form: FormGroup;

  title: String;
  body: String;

  THEME: string = 'github';
  LANG: string = 'c_cpp';

  code: string = '';

  constructor(
    public fb: FormBuilder,
    private uservice: LoginService,
    private cpservice: CompetitionService
  ) {
    this.form = this.fb.group({
      script: [null],
      language: [''],
    });
  }


  ngAfterViewInit(): void {
    this.cpservice.fetchCompetitionbyId(
      localStorage.getItem('running')
    ).subscribe(
      (comp) => {
        this.title = comp.title;
        this.body = comp.problem;
      }
    );
    ace.config.set('basePath', 'path');
    ace.config.set("fontSize", "16px");
    ace.require('ace/ext/language_tools');
    this.editorBeautify = ace.require('ace/ext/beautify');
    const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 14,
      maxLines: Infinity,
    };
    const extraEditorOptions = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    };
    const editorOptions = Object.assign(basicEditorOptions, extraEditorOptions);
    this.aceEditor = ace.edit(this.editor.nativeElement, editorOptions);
    this.aceEditor.setTheme('ace/theme/' + this.THEME);
    this.aceEditor.session.setMode('ace/mode/' + this.LANG);
  }

  public runCode() {
    this.code = this.aceEditor.session.getValue();
    this.cpservice.submitCode(
      localStorage.getItem('running'),
      {
        'username' : this.uservice.getUser(),
        'script' : this.code,
        'language' : this.LANG
      }
    ).subscribe(
      (response) => alert(response),
      (error) => {
        alert("Something went wrong, we are fixing the issue!");
        console.log(error);
      }
    )
  }

  public beautifyContents() {
    if (this.aceEditor && this.editorBeautify) {
      const session = this.aceEditor.getSession();
      this.editorBeautify.beautify(session);
    }
  }

  public updateTheme() {
    this.aceEditor.setTheme('ace/theme/' + this.THEME);
  }

  public updateLang() {
    this.aceEditor.session.setMode('ace/mode/' + this.LANG);
    this.aceEditor.session.setValue("");
    this.form.patchValue({
      language: this.LANG,
    });
    this.form.get('language').updateValueAndValidity();
  }

  uploadSource(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      script: file,
      language: this.LANG,
    });
    this.form.get('script').updateValueAndValidity();
    this.form.get('language').updateValueAndValidity();
  }

  runFile() {
    var formData: any = new FormData();
    formData.append("username", this.uservice.getUser());
    formData.append("script", this.form.get('script').value);
    formData.append("language", this.form.get('language').value);
    this.cpservice.submitFile(
      localStorage.getItem('running'),
      formData
    ).subscribe(
      (response) => alert(response),
      (error) => {
        alert("Something went wrong, we are fixing the issue!");
        console.log(error);
      }
    )
  }

}