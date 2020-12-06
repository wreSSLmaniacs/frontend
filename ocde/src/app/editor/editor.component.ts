import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { RunService } from '../run.service';
import { RunInput } from '../run_input';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from "../login.service";

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-chaos';
import 'ace-builds/src-noconflict/theme-chrome';
import 'ace-builds/src-noconflict/theme-cobalt';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { EditorDialogComponent } from '../editor-dialog/editor-dialog.component';
import { FileService } from '../file.service';

import { File } from '../file';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements AfterViewInit {

  @ViewChild('codeEditor') private editor: ElementRef<HTMLElement>;
  private aceEditor : ace.Ace.Editor;
  private editorBeautify;

  files: File[] = [];
  currentfile: string = '';
  form: FormGroup;

  THEME : string = 'github';
  LANG : string = 'c_cpp';

  code : string = '';
  input : string = '';
  output : string = '';

  constructor(
    public fb: FormBuilder,
    private runscript : RunService,
    public dialog: MatDialog,
    private fileService: FileService,
    private uservice: LoginService
    ) { 
      this.form = this.fb.group({
        script: [null],
        language: [''],
        input: ['']
      });
    }

  ngOnInit() {
      this.getFiles();
  }

  getFiles(): void {
      this.fileService.getFiles(this.uservice.getUser()).subscribe(files => this.files=files);
  }

  ngAfterViewInit(): void {
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
    this.aceEditor.setTheme('ace/theme/'+this.THEME);
    this.aceEditor.session.setMode('ace/mode/'+this.LANG);
    this.aceEditor.session.setValue(
`#include<bits/stdc++.h>
using namespace std;
int main() {
  // code goes here
  return 0;
}`    
    );
  }

  public runCode() {
      this.code = this.aceEditor.session.getValue();
      const send : RunInput = {
        username : this.uservice.getUser(),
        script : this.code,
        language : this.LANG,
        input : this.input
      };
      console.log(send);
      this.runscript.runScript(send).subscribe(receivied =>
        {
          if(receivied.success==true) {
            this.output = receivied.output;
          }   
          else {
            this.output = "Error: " + receivied.output;
          }
        });
  }

  public beautifyContents() {
    if (this.aceEditor && this.editorBeautify) {
      const session = this.aceEditor.getSession();
      this.editorBeautify.beautify(session);
   }
  }

  public updateTheme() {
    this.aceEditor.setTheme('ace/theme/'+this.THEME);
  }

  public updateLang() {
    this.aceEditor.session.setMode('ace/mode/'+this.LANG);
    switch(this.LANG) {
      case 'c_cpp': {
        this.aceEditor.session.setValue(
`#include<bits/stdc++.h>
using namespace std;
int main() {
  // code goes here
  return 0;
}`
        );
        break;
      }
      case 'python': {
        this.aceEditor.session.setValue("");
      }
      case 'java': {
        this.aceEditor.session.setValue("");
      }
    }
  }

  openDialog(){
    var filename;
    let dialogRef = this.dialog.open(EditorDialogComponent, {
      data: {filename: filename}});

    dialogRef.afterClosed().subscribe(result=>{
      if(!result){return;}
      console.log(`Dialog Result: ${result}`);
      this.currentfile = result;
      this.saveFile(result);
    });
  }

  saveFile(filename = this.currentfile): void{
    if(!filename){return;}
      this.code = this.aceEditor.session.getValue();
      this.fileService.saveFile(
        {
          filename: filename,
          script: this.code
        } as File, this.uservice.getUser()).subscribe(
        file=>{
          console.log(file);
          for(let item in this.files){
            if(this.files[item].filename == file.filename){
              this.files[item] = file;
              return;
            }
          }
          this.files.push(file)
        }); 
  }

  setFile(file: File){
    this.currentfile = file.filename;
    this.aceEditor.session.setValue(file.script);
  }

  uploadSource(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      script: file,
      language: this.LANG,
      input: this.input
    });
    this.form.get('script').updateValueAndValidity();
    this.form.get('language').updateValueAndValidity();
    this.form.get('input').updateValueAndValidity();
  }

  runFile() {
    var formData: any = new FormData();
    formData.append("username", this.uservice.getUser());
    formData.append("script", this.form.get('script').value);
    formData.append("language", this.form.get('language').value);
    formData.append("input", this.form.get('input').value);
    this.runscript.runFile(formData).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )
  } 

  delete(file: File): void {
    this.files = this.files.filter(f => f !== file);
    this.fileService.deleteFile(file.filename,this.uservice.getUser()).subscribe();
  }

} 