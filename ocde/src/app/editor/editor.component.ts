import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/theme-ambiance';
import 'ace-builds/src-noconflict/theme-github';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements AfterViewInit {

  @ViewChild('codeEditor') private editor: ElementRef<HTMLElement>;
  private aceEditor : ace.Ace.Editor;

  THEME : string = 'ace/theme/github';
  LANG : string = 'ace/mode/c_cpp';

  constructor() { }

  ngAfterViewInit(): void {
    ace.config.set("fontSize", "14px");
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.setTheme(this.THEME);
    this.aceEditor.session.setMode(this.LANG);
    this.aceEditor.session.setValue("#include<bits/stdc++.h>");
  }

  public getCode() {
    const code = this.aceEditor.getValue();
    console.log(code);
  }

  public updateTheme() {
    this.aceEditor.setTheme(this.THEME);
  }

  public updateLang() {
    this.aceEditor.session.setMode(this.LANG);
    switch(this.LANG) {
      case 'ace/mode/c_cpp': {
        this.aceEditor.session.setValue("#include<bits/stdc++.h>");
        break;
      }
      case 'ace/mode/python': {
        this.aceEditor.session.setValue("import os");
        break;
      }
    }
  }

} 