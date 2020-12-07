import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { RunService } from '../run.service';
import { RunInput } from '../run_input';
import { MatDialog } from '@angular/material/dialog';
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
import { EditorDialogComponent } from '../editor-dialog/editor-dialog.component';
import { FileService } from '../file.service';

import { File } from '../file';
// import { CompileShallowModuleMetadata } from '@angular/compiler';
// import { resolve } from 'dns';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements AfterViewInit {

  @ViewChild('codeEditor') private editor: ElementRef<HTMLElement>;
  private aceEditor : ace.Ace.Editor;
  private editorBeautify;
  public fileString;

  files: File[] = [];
  folders: string[] = [];
  list: NavigationModel[] = [];
  currentfile: NavigationModel = {
        title: '',
        isFile: true,
        children: [],
  };
  dirk: string = '.';
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
      this.getFiles(false,false);
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
  cout << "Hello World" << endl;
  return 0;
}`    
    );
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
  cout << "Hello World" << endl;
  return 0;
}`
        );
        break;
      }
      case 'python': {
        this.aceEditor.session.setValue("");
      }
      case 'r': {
        this.aceEditor.session.setValue("");
      }
    }
  }

  openDialog(text: String){
    var filename;
    let dialogRef = this.dialog.open(EditorDialogComponent, {
      data: {filename: filename, text: text}});

    dialogRef.afterClosed().subscribe(result=>{
      if(!result){return;}
      console.log(`Dialog Result: ${result}`);
      if(text == "File") {
        const file: NavigationModel = {
          title: result,
          isFile: true,
          children: [],
          url: this.dirk
        }
        this.saveFile(file);
      }
      else {
        const folder: NavigationModel = {
          title: result,
          isFile: false,
          children: [],
          url: this.dirk
        }
        this.saveFolder(folder);
      }
    });
  }

  // ---------------FOLDER EDITINGS---------------------

  insert(url:string): NavigationModel[] {
    var temp: NavigationModel[] = []
    for(var folder of this.folders) {
      const item: NavigationModel = {
        title: folder,
        isFile: false,
        children: [],
        url: url
      }
      temp.push(item);
    }

    for (var val of this.files) {
      const item: NavigationModel = {
        title: val.filename,
        isFile: true,
        children: [],
        file: val,
        url: url
      }
      temp.push(item);
    }

    return temp;
  }

  insertStructure(table: NavigationModel[], dir: string[], url: string): NavigationModel[] {
    if(dir.length == 0) {
      return this.insert(url);
    }

    for(var item of table){
      if(!item.isFile && item.title==dir[0]) {
        dir = dir.splice(1);
        item.children = this.insertStructure(item.children, dir, url);
        break;
      }
    }
    return table;
  }

  deleteStructure(table: NavigationModel[], dir: string[]): NavigationModel[] {
    console.log(dir);
    if(dir.length == 0) {
      var empty: NavigationModel[] = [];
      return empty;
    }

    for(var item of table){
      if(!item.isFile && item.title===dir[0]) {
        dir = dir.splice(1);
        item.children = this.deleteStructure(item.children, dir);
      }
    }
    return table;
  }

  deleteFolderStruc(table: NavigationModel[], dir: string[], folder: string): NavigationModel[] {
    if(dir.length == 0) {
      table = table.filter(f=> f.isFile ||  f.title != folder)
      return table;
    }

    for(var item of table){
      if(!item.isFile && item.title==dir[0]) {
        dir = dir.splice(1);
        item.children = this.deleteFolderStruc(item.children, dir, folder);
        break;
      }
    }
    return table;
  }

  editFolder(table: NavigationModel[], dir: string[], folder: string): NavigationModel[] {
    if(dir.length == 0) {
      var item: NavigationModel = {
        title: folder,
        isFile: false,
        url: this.dirk,
        children: []
      }
      table.push(item);
      return table;
    }

    for(var item of table){
      if(!item.isFile && item.title==dir[0]) {
        dir = dir.splice(1);
        item.children = this.editFolder(item.children, dir, folder);
        break;
      }
    }
    return table;
  }

  saveFolder(foldername: NavigationModel): void{
    this.fileService.saveFile(
      {
        filename: "trash.trash",
        script: foldername.title
      } as File, this.uservice.getUser(), this.dirk + "/" + foldername.title).subscribe(
      file=>{
        console.log(file);

        var dirs: string[] = this.dirk.split('/')
        dirs = dirs.splice(1);
        this.list = this.editFolder(this.list, dirs, foldername.title);
      }); 
  }

  // ------------------------ FILE HELPERS -------------------

  deleteFileStruc(table: NavigationModel[], dir: string[], file: File): NavigationModel[] {
    if(dir.length == 0) {
      table = table.filter(f=> !f.isFile || f.file != file)
      return table;
    }

    for(var item of table){
      if(!item.isFile && item.title==dir[0]) {
        dir = dir.splice(1);
        item.children = this.deleteFileStruc(item.children, dir, file);
        break;
      }
    }
    return table;
  }

  editFile(table: NavigationModel[], dir: string[], file: File): NavigationModel[] {
    if(dir.length == 0) {
      var flag: boolean = false;
      for(var item of table) {
        if(item.title == file.filename){
          item.file = file;
          flag = true;
          break;
        }
      }
      if(!flag){
        var item: NavigationModel = {
          title: file.filename,
          isFile: true,
          url: this.dirk,
          children: [],
          file: file
        }
        table.push(item);
      }
      return table;
    }

    for(var item of table){
      if(!item.isFile && item.title==dir[0]) {
        dir = dir.splice(1);
        item.children = this.editFile(item.children, dir, file);
        break;
      }
    }
    return table;
  }

  saveFile(filename = this.currentfile): void{
    if(!filename){
      return this.openDialog("File");
    }
    this.code = this.aceEditor.session.getValue();
    this.fileService.saveFile(
      {
        filename: filename.title,
        script: this.code
      } as File, this.uservice.getUser(), this.dirk).subscribe(
      file=>{
        console.log(file);

        var dirs: string[] = this.dirk.split('/')
        dirs = dirs.splice(1);
        this.list = this.editFile(this.list, dirs,file);
        console.log(this.list);
      }); 
  }

  getFiles(newFolder: boolean, deleteFolder: boolean): void {
    this.fileService.getFiles(this.uservice.getUser(),this.dirk).subscribe(
      files => {this.files=files;
      this.folders = this.files.filter(f=> f.filename === "trash.trash").map(f=>f.script)
      this.files = this.files.filter(f => f.filename !== "trash.trash");
      if(newFolder) {
        var dirs: string[] = this.dirk.split('/')
        dirs = dirs.splice(1);
        this.list = this.insertStructure(this.list, dirs,this.dirk);
      }
      else if(deleteFolder) {
        if(this.dirk == '.')
          return;
        var dirs: string[] = this.dirk.split('/')
        dirs = dirs.splice(1);
        this.list = this.deleteStructure(this.list, dirs);
        var loc = this.dirk.lastIndexOf("/");
        if(loc !== -1) {
          this.dirk = this.dirk.substring(0,loc);
        }
        console.log(this.dirk);
      }
      else{
        this.list = this.insert(this.dirk);
      }
      console.log(this.list);
    }
    );
}

  // ------------------------- LOAD FILE/FOLDER INFORMATION --------------------


  setFile(file: NavigationModel){
    this.currentfile = file;
    this.dirk = file.url;
    this.aceEditor.session.setValue(file.file.script);
  }

  setFolder(folder: NavigationModel){
    this.dirk = folder.url + "/" + folder.title;
    console.log(this.dirk);
    this.getFiles(true,false);
  }

  deleteFile(file: NavigationModel): void {
    this.dirk = file.url;
    var dirs: string[] = this.dirk.split('/')
    dirs = dirs.splice(1);
    this.list = this.deleteFileStruc(this.list,dirs,file.file);
    this.fileService.deleteFile(file.title,this.uservice.getUser(), this.dirk).subscribe();
  }

  deleteFolder(folder: NavigationModel): void {
    this.dirk = folder.url;
    var drk: string = this.dirk + "/" + folder.title
    var dirs: string[] = this.dirk.split('/')
    dirs = dirs.splice(1);
    this.list = this.deleteFolderStruc(this.list,dirs, folder.title);
    this.fileService.deleteFolder(this.uservice.getUser(), drk).subscribe();
  }

  goBack(): void {
    this.getFiles(false,true);
  }


  // ------------------- EXECUTE CODE OPERATIONS -------------------

  uploadSource(event) {
    const file = (event.target as HTMLInputElement).files[0];

    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      this.fileString = fileReader.result;
    }

    fileReader.readAsText(file)
    
    this.form.patchValue({
      script: this.fileString,
      language: this.LANG,
      input: this.input
    });
    this.form.get('script').updateValueAndValidity();
    this.form.get('language').updateValueAndValidity();
    this.form.get('input').updateValueAndValidity();
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

  runFile() {
    const send : RunInput = {
      username : this.uservice.getUser(),
      script : this.fileString,
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
} 

class NavigationModel {
  public title: string;
  public url?: string;
  public isFile: boolean;
  public file?: File;
  public children: NavigationModel[];
}