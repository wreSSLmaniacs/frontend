import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder } from "@angular/forms";
import { RunService } from '../run.service';
import { RunInput } from '../run_input';
import { RenameFile } from '../renameFile';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from "../login.service";

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
import { EditorDialogComponent } from '../editor-dialog/editor-dialog.component';
import { FileService } from '../file.service';

import { File } from '../file';
import { Navigation } from '@angular/router';

/**Description
   * 
   * The life of the project, the editor component. Its functionality can be studied in 2 parts
   * 
   * 1. Editor :
   * The editor is created using the "Ace" library
   * The view uses ngAfterViewInit which is needed for @ViewChild decorator
   * The code is stored as a formatted string, along with the language and theme
   * 
   * The editor supports basic autocomplete and align (beautify) capabilities
   * The code uses https://medium.com/@ofir3322/create-an-online-ide-with-angular-6-nodejs-part-1-163a939a7929 as a starting point
   * 
   * The project also allows for running files via direct uploads
   * 
   * 2. Directory Structure
   * The directory is stored as a recursive list of objects of class type NavigationModel
   * The structure supports file and folder creation, deletion and renaming
   * Provides a system for modularising code and running with various imports and dependencies
   */

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
      case 'ruby': {
        this.aceEditor.session.setValue("");
      }
    }
  }

   /** Description
     * Function creates a pop up component of Editor-dialog to get name of new File/Folder or new name of existing
     */
  openDialog(text: String, text2:String, rename = false,oldName='',url=''){
    var filename;
    let dialogRef = this.dialog.open(EditorDialogComponent, {
      data: {filename: filename, text: text, text2: text2}});

    dialogRef.afterClosed().subscribe(result=>{
      if(!result){return;}
      console.log(`Dialog Result: ${result}`);
      if(!rename){
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
      }
      else{
        if(text=="File") {
          this.newNameFile(oldName,result,url)
        }
        else {
          this.newNameFolder(oldName,result,url)
        }
      }
    },err=>{
      alert("An error occurred");
      console.log(err);
    });
  }

  // ---------------FOLDER EDITINGS---------------------

  /** Description
     * Create new list of objects containing the obtained files and folders
     * @param url local path address of objects inserted
     */
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

  /** Description
     * Insert list of files and folders at given local path location
     * @param table list of objects containing files and folders
     * @param dir  list of strings containing individual subdirectory names
     * @param url local path address of objects inserted
     */
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

  /** Description
     * Deletes all children of the folder but not folder itself
     * @param table list of objects containing files and folders
     * @param dir list of strings containing individual subdirectory names
     */
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

  /** Description
     * Deletes folder and all its children
     * @param table list of objects containing files and folders
     * @param dir list of strings containing individual subdirectory names
     * @param folder string for name of folder to be deleted
     */
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

   /** Description
     * Creates new folder and adds to the list of objects this.list
     * @param table list of objects containing files and folders
     * @param dir list of strings containing individual subdirectory names
     * @param folder string for name of new folder
     */
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

  /** Description
     * Fix local path values for al children of renamed folder
     * @param table list of objects containing files and folders
     * @param url name of new url of all objects in table
     */
  fixUrl(table: NavigationModel[],url: string): NavigationModel[] {
    console.log(url);
    for(var item of table){
      item.url = url;
      if(!item.isFile) {
        item.children = this.fixUrl(item.children, url + "/" + item.title)
      }
    }
    return table;
  }

   /** Description
     * Renames an existing folder and updates local path values to objects in this.list
     * @param table  list of objects containing files and folders
     * @param dir  list of strings containing individual subdirectory names
     * @param newName string for name of renamed folder
     * @param oldName  string for original name of folder
     */
  renameListFolder(table: NavigationModel[], dir: string[], newName: string, oldName: string): NavigationModel[] {
    if(dir.length == 0) {
      for(var item of table){
        if(!item.isFile && item.title == oldName){
          item.title = newName;
          item.children = this.fixUrl(item.children,item.url + "/" + newName);
          break;
        }
      } 
      return table;
    }

    for(var item of table){
      if(!item.isFile && item.title==dir[0]) {
        dir = dir.splice(1);
        item.children = this.renameListFolder(item.children, dir, newName,oldName);
        break;
      }
    }
    return table;
  }

  /** Description
     * Function calls FileService method to create new folder on backend database
     * @param foldername object containing folder name and local path location
     */
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
      },
      err=>{
        alert("An error occurred");
        console.log(err);
      }); 
  }

  /** Description
     * Function calls FileService method to rename folder on backend database
     * @param oldName string for original name of folder
     * @param newName string for new name of folder
     * @param url local path location for folder
     */
  newNameFolder(oldName: string, newName: string, url: string): void {
    this.fileService.renameFile(
      {
        newName: newName, 
        oldName: oldName,
        file: false} as RenameFile, url,this.uservice.getUser()).subscribe(
      file=>{
        var dirs: string[] = url.split('/')
        dirs = dirs.splice(1);
        this.list = this.renameListFolder(this.list, dirs, newName, oldName);
      },
      err=>{
        alert("An error occurred");
        console.log(err);
      });
  }

  // ------------------------ FILE HELPERS -------------------

  /** Description
     * Deletes file from this.list of objects
     * @param table list of objects containing files and folders
     * @param dir list of strings containing individual subdirectory names
     * @param file File object containing filename and code script
     */
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

   /** Description
     * Creates new file and adds to the list of objects this.list
     * @param table list of objects containing files and folders
     * @param dir  list of strings containing individual subdirectory names
     * @param file File object containing filename and code script
     */
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

  /** Description
     * Renames an existing file in list of objects this.list
     * @param table list of objects containing files and folders
     * @param dir list of strings containing individual subdirectory names
     * @param newName  string for name of renamed file
     * @param oldName string for original name of file
     */
  renameListFile(table: NavigationModel[], dir: string[], newName: string, oldName: string): NavigationModel[] {
    if(dir.length == 0) {
      for(var item of table){
        if(item.isFile && item.title == oldName){
          item.title = newName;
        }
      }
      return table;
    }

    for(var item of table){
      if(!item.isFile && item.title==dir[0]) {
        dir = dir.splice(1);
        item.children = this.renameListFile(item.children, dir, newName,oldName);
        break;
      }
    }
    return table;
  }

  
  /** Description
     * Function calls FileService method to create new file on backend database
     * @param filename File object containing filename and code script
     */
  saveFile(filename = this.currentfile): void{
    if(filename.title==''){
      return this.openDialog("File","Create New File");
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
      },err=>{
        alert("An error occurred");
        console.log(err);
      }); 
  }

  /** Description
     * Function calls FileService method to rename file on backend database
     * @param oldName string for original name of file
     * @param newName string for new name of file
     * @param url local path location for file
     */
  newNameFile(oldName: string, newName: string, url: string): void {
    this.fileService.renameFile(
      {
        newName: newName, 
        oldName: oldName,
        file: true} as RenameFile, url,this.uservice.getUser()).subscribe(
      file=>{
        var dirs: string[] = url.split('/')
        dirs = dirs.splice(1);
        this.list = this.renameListFile(this.list, dirs, newName, oldName);
      },
      err=>{
        alert("An error occurred");
        console.log(err);
      });
  }

  /** Description
     * Function executed on ngInit and every time nested folder contents is to be viewed or closed
     * @param newFolder True if nested folder contents is to be viewed
     * @param deleteFolder True if nested folder is closed
     */
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
    },err=>{
      alert("An error occurred");
      console.log(err);
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
    this.fileService.deleteFile(file.title,this.uservice.getUser(), this.dirk).subscribe(err=>{
      alert("An error occurred");
      console.log(err);
    });
  }

  deleteFolder(folder: NavigationModel): void {
    this.dirk = folder.url;
    var drk: string = this.dirk + "/" + folder.title
    var dirs: string[] = this.dirk.split('/')
    dirs = dirs.splice(1);
    this.list = this.deleteFolderStruc(this.list,dirs, folder.title);
    this.fileService.deleteFolder(this.uservice.getUser(), drk).subscribe(err=>{
      alert("An error occurred");
      console.log(err);
    });
  }

  renameFile(file: NavigationModel): void {
    this.openDialog("File","Rename File",true,file.title, file.url);
  }

  renameFolder(folder: NavigationModel): void {
    this.openDialog("Folder","Rename Folder",true, folder.title, folder.url);
  }

  goBack(): void {
    this.getFiles(false,true);
  }


  // ------------------- EXECUTE CODE OPERATIONS -------------------

  /** Description
     * Here, we use the typescript FileReader to upload files the same way we upload editor code
     * UPDATE : We would like to render the contents of the file into the editor in the next update
     */
  uploadSource(event) {
    const file = (event.target as HTMLInputElement).files[0];

    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {
      this.fileString = fileReader.result;
    }

    /// remove comment to UPDATE :
    /// this.aceEditor.session.setValue(this.fileString); 

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

  /** Description
     * Executed when the user presses the Run button, this function sends the editor content to the server
     * Along with the code, the "input" contents are also sent to the server
     * The server responds with the output which is rendered in the output textarea
     */
  public runCode() {
    this.code = this.aceEditor.session.getValue();
    const send : RunInput = {
      username : this.uservice.getUser(),
      script : this.code,
      language : this.LANG,
      input : this.input
    };
    console.log(send);
    this.runscript.runScript(send,this.uservice.getUser(),this.currentfile.url).subscribe(receivied =>
      {
        if(receivied.success==true) {
          this.output = receivied.output;
        }   
        else {
          this.output = "Error: " + receivied.output;
        }
      },err=>{
        alert("An error occurred");
        console.log(err);
      });
}

  /** Description
     * Executed when the user presses the Run File button, this function sends the file content to the server
     * Along with the code, the "input" contents are also sent to the server
     * The server responds with the output which is rendered in the output textarea
     */
  runFile() {
    const send : RunInput = {
      username : this.uservice.getUser(),
      script : this.fileString,
      language : this.LANG,
      input : this.input
    };
    console.log(send);
    this.runscript.runScript(send,this.uservice.getUser(), "").subscribe(receivied =>
      {
        if(receivied.success==true) {
          this.output = receivied.output;
        }   
        else {
          this.output = "Error: " + receivied.output;
        }
      },err=>{
        alert("An error occurred");
        console.log(err);
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