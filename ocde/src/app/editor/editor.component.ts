import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-ambiance';

const THEME = 'ace/theme/github';
const LANG = 'ace/mode/c_cpp';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements AfterViewInit {

  @ViewChild('codeEditor') private editor: ElementRef<HTMLElement>;
  private aceEditor : ace.Ace.Editor;

  constructor() { }

  ngAfterViewInit(): void {
    ace.config.set("fontSize", "14px");
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue("#include<bits/stdc++.h>");
    this.aceEditor.setTheme(THEME);
    this.aceEditor.session.setMode(LANG);
  }

  public getCode() {
    const code = this.aceEditor.getValue();
    console.log(code);
  }

}
