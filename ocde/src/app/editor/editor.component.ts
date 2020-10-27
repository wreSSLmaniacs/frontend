import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-ambiance';

const THEME = 'ace/theme/ambiance';
const LANG = 'ace/mode/c_cpp';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

export class EditorComponent implements OnInit {

  @ViewChild('codeEditor') codeEditorElmRef : ElementRef;
  private codeEditor : ace.Ace.Editor;

  constructor() { }

  ngOnInit(): void {
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 10,
      maxLines: Infinity,
    };
    this.codeEditor = ace.edit(element,editorOptions);
    this.codeEditor.setTheme(THEME);
    this.codeEditor.session.setMode(LANG);
    this.codeEditor.setValue("the new text here");
    this.codeEditor.setShowFoldWidgets(true);
  }

  public getCode() {
    const code = this.codeEditor.getValue();
    console.log(code);
  }

}
