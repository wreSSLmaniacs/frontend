import { AfterViewInit, Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from "@angular/forms";
import { LoginService } from "../login.service";

import { interval, Subscription } from "rxjs";
import { ActivatedRoute,Router } from "@angular/router";

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-ruby';
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

  id: number;
  startexecution: Boolean = false;

  private subscription : Subscription;

  private aceEditor: ace.Ace.Editor;
  private editorBeautify;

  passed: Boolean = false;
  points: number;

  allowed: Boolean = false;
  working: Boolean = true;

  form: FormGroup;

  title: String;
  body: String;

  THEME: string = 'github';
  LANG: string = 'c_cpp';

  code: string = '';

  constructor(
    public fb: FormBuilder,
    private uservice: LoginService,
    private cpservice: CompetitionService,
    private _router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      script: [null],
      language: [''],
    });
    this.route.params.subscribe(
      (params) => {
        this.id = params.id;
        this.startexecution = true;
      }
    )
  }

  ngAfterViewInit(): void {
    while(!this.startexecution) {;}
    this.subscription = interval(60000)
      .subscribe(x => { this.validate(); });
    this.cpservice.fetchCompetitionbyId(this.id).subscribe(
      (comp) => {
        this.title = comp.title;
        this.body = comp.problem;
      }
    );
    this.checkRunning();
    this.getPoints();
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

  loaded() : Boolean {
    return true;
  }

  // Helpers //
  getPoints() {
    this.cpservice.contestPassed(this.id).subscribe(
      (res) => {
        this.passed = res.passed;
        this.points = res.points;
      }
    );
  }

  checkRunning() {
    this.cpservice.isContestRunning(this.id).subscribe(
      (res) => {
        this.allowed = res;
        this.working = res;
      }
    );
  }

  validate() {
    this.checkRunning();
    if(!this.working) {
      alert("Competition Expired! You're being taken to your profile!");
      this._router.navigate(['/profile']);
    }
  }
  // // 

  public runCode() {
    this.code = this.aceEditor.session.getValue();
    this.cpservice.submitCode(
      this.id,
      {
        'username' : this.uservice.getUser(),
        'script' : this.code,
        'language' : this.LANG
      }
    ).subscribe(
      (response) => {
        alert(response);
        this.getPoints();
      },
      (error) => {
        alert("Something went wrong, we are fixing the issue!");
        console.log(error);
      }
    );
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
      this.id,
      formData
    ).subscribe(
      (response) => {
        alert(response);
        this.getPoints();
      },
      (error) => {
        alert("Something went wrong, we are fixing the issue!");
        console.log(error);
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}